import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PROMPT_ID = "pmpt_6879ae7701508193bd851d67f28e2af203fe62a7b68b40be";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { input } = req.body; // Expecting { input: "user's question" }
  if (!input) {
    return res.status(400).json({ error: "input is required" });
  }
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: {
          id: PROMPT_ID,
          version: "1",
          input: input,
        }
      }),
    });
    const data = await openaiRes.json();
    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: data.error || data });
    }
    // The response format may differ; adjust as needed
    res.status(200).json({ reply: data.data?.[0]?.text || data.choices?.[0]?.text || data, full: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
} 