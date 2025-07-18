import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { messages, stream } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }
  try {
    if (stream) {
      // Streaming mode
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
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
          // OpenAI streams data as lines starting with 'data: '
          const chunk = decoder.decode(value);
          // Split by newlines and filter out keep-alive lines
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
              } catch (e) {
                // Ignore JSON parse errors for non-data lines
              }
            }
          });
        }
        done = doneReading;
      }
      res.end();
      return;
    } else {
      // Non-streaming mode (fallback)
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
        }),
      });
      const data = await openaiRes.json();
      if (!openaiRes.ok) {
        return res.status(openaiRes.status).json({ error: data.error || data });
      }
      const reply = data.choices?.[0]?.message?.content || '';
      res.status(200).json({ reply, full: data });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
} 