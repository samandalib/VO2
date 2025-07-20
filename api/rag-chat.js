import fetch from 'node-fetch';
import { Readable } from 'stream';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getBaseUrl(req) {
  if (req.headers['x-forwarded-host']) {
    return `https://${req.headers['x-forwarded-host']}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_CHAT_MODEL = 'gpt-4o';

async function getRelevantChunks(query, req) {
  const baseUrl = getBaseUrl(req);
  const RAG_RETRIEVE_URL = `${baseUrl}/api/rag-retrieve`;
  const res = await fetch(RAG_RETRIEVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'RAG retrieval error');
  return data.chunks;
}

async function getPromptTemplates() {
  try {
    const { data, error } = await supabase
      .from('rag_settings')
      .select('key, value')
      .in('key', ['user_instruction', 'system_prompt']);
    if (error || !data) throw error;
    return {
      userInstruction: data.find(d => d.key === 'user_instruction')?.value ||
        'Answer the following question using only the provided context. If the answer is not in your context, say you don’t know.',
      systemPrompt: data.find(d => d.key === 'system_prompt')?.value ||
        'You are a helpful research assistant. Only answer using the provided context.'
    };
  } catch (e) {
    return {
      userInstruction: 'Answer the following question using only the provided context. If the answer is not in your context, say you don’t know.',
      systemPrompt: 'You are a helpful research assistant. Only answer using the provided context.'
    };
  }
}

function buildPrompt(contextChunks, userQuery, userInstruction) {
  const context = contextChunks.map((c, i) => `Chunk ${i + 1} (${c.filename}):\n${c.chunk_text}`).join('\n\n');
  return `${userInstruction}\n\nContext:\n${context}\n\nQuestion: ${userQuery}`;
}

export default async function handler(req, res) {
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
    const chunks = await getRelevantChunks(query, req);
    const { userInstruction, systemPrompt } = await getPromptTemplates();
    const prompt = buildPrompt(chunks, query, userInstruction);
    // Stream the answer from OpenAI using Node.js stream API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
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
    openaiRes.body.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      lines.forEach(line => {
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
    });
    openaiRes.body.on('end', () => {
      res.end();
    });
    openaiRes.body.on('error', (err) => {
      console.error('Stream error:', err);
      res.end();
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
} 