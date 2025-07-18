// api/rag-chat.cjs
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const RAG_RETRIEVE_URL = 'http://localhost:3000/api/rag-retrieve'; // Update if deployed elsewhere
const OPENAI_CHAT_MODEL = 'gpt-4o';

async function getRelevantChunks(query) {
  // Call the local rag-retrieve endpoint
  const res = await fetch(RAG_RETRIEVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'RAG retrieval error');
  return data.chunks;
}

function buildPrompt(contextChunks, userQuery) {
  const context = contextChunks.map((c, i) => `Chunk ${i + 1} (${c.filename}):\n${c.chunk_text}`).join('\n\n');
  return `Answer the following question using only the provided context. If the answer is not in the context, say you don’t know.\n\nContext:\n${context}\n\nQuestion: ${userQuery}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Missing query' });
    return;
  }
  try {
    const chunks = await getRelevantChunks(query);
    const prompt = buildPrompt(chunks, query);
    // Stream the answer from OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful research assistant. Only answer using the provided context.' },
          { role: 'user', content: prompt },
        ],
        stream: true,
      }),
    });
    if (!openaiRes.body) {
      return res.status(500).json({ error: 'No response body from OpenAI' });
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (value) {
        const chunk = decoder.decode(value);
        chunk.split('\n').forEach(line => {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim();
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(content);
              }
            } catch (e) {}
          }
        });
      }
      done = doneReading;
    }
    res.end();
    return;
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}; 