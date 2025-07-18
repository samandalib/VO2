import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAIStream, streamText } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }
  try {
    // Use the Vercel AI SDK to stream the OpenAI response
    const response = await streamText({
      model: 'gpt-4o',
      messages,
      api: openai,
    });
    return OpenAIStream(response, res);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
} 