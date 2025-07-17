import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = "asst_83EzuOE7VeIjWFuSR8zcbuon";
const OPENAI_BASE_URL = "https://api.openai.com/v1";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { message, thread_id } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    let threadId = thread_id;
    if (!threadId) {
      const threadResp = await axios.post(
        `${OPENAI_BASE_URL}/threads`,
        {},
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1",
            "Content-Type": "application/json",
          },
        }
      );
      threadId = threadResp.data.id;
    }

    await axios.post(
      `${OPENAI_BASE_URL}/threads/${threadId}/messages`,
      {
        role: "user",
        content: message,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1",
          "Content-Type": "application/json",
        },
      }
    );

    const runResp = await axios.post(
      `${OPENAI_BASE_URL}/threads/${threadId}/runs`,
      {
        assistant_id: ASSISTANT_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1",
          "Content-Type": "application/json",
        },
      }
    );
    const runId = runResp.data.id;

    let status = runResp.data.status;
    let attempts = 0;
    while (status !== "completed" && attempts < 30) {
      await sleep(1000);
      const pollResp = await axios.get(
        `${OPENAI_BASE_URL}/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1",
          },
        }
      );
      status = pollResp.data.status;
      if (status === "failed" || status === "cancelled") {
        return res.status(500).json({ error: "Assistant run failed" });
      }
      attempts++;
    }
    if (status !== "completed") {
      return res.status(500).json({ error: "Assistant run timed out" });
    }

    const messagesResp = await axios.get(
      `${OPENAI_BASE_URL}/threads/${threadId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1",
        },
      }
    );
    const messages = messagesResp.data.data;
    const assistantMsg = messages.find((m: any) => m.role === "assistant");
    if (!assistantMsg) {
      return res.status(500).json({ error: "No assistant reply found" });
    }
    res.json({ reply: assistantMsg.content[0].text.value, thread_id: threadId });
  } catch (err: any) {
    console.error("OpenAI Assistant error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
} 