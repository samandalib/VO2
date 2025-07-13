import { RequestHandler } from "express";
import OpenAI from "openai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatRequest {
  message: string;
  threadId?: string; // Optional: to continue existing conversation
}

interface ChatResponse {
  message: string;
  threadId: string;
  timestamp: number;
}

export const chat: RequestHandler = async (req, res) => {
  try {
    const { message, threadId } = req.body as ChatRequest;

    // Validate the input
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let currentThreadId = threadId;

    // Try to use Assistant API if Assistant ID is configured
    if (process.env.OPENAI_ASSISTANT_ID) {
      try {
        console.log("Using Assistant API for chat...");

        // Create or use existing thread
        let thread;
        if (currentThreadId) {
          // Use existing thread
          thread = { id: currentThreadId };
          console.log("Using existing thread:", currentThreadId);
        } else {
          // Create new thread
          thread = await openai.beta.threads.create();
          currentThreadId = thread.id;
          console.log("Created new thread:", currentThreadId);
        }

        // Add user message to thread
        await openai.beta.threads.messages.create(currentThreadId, {
          role: "user",
          content: message,
        });

        // Run the assistant
        const run = await openai.beta.threads.runs.create(currentThreadId, {
          assistant_id: process.env.OPENAI_ASSISTANT_ID,
        });

        // Wait for completion
        let runStatus = await openai.beta.threads.runs.retrieve(
          currentThreadId as any,
          run.id as any,
        );
        let attempts = 0;
        const maxAttempts = 30;

        while (
          (runStatus.status === "queued" ||
            runStatus.status === "in_progress") &&
          attempts < maxAttempts
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          runStatus = await openai.beta.threads.runs.retrieve(
            currentThreadId as any,
            run.id as any,
          );
          attempts++;
        }

        if (runStatus.status !== "completed") {
          throw new Error(
            `Assistant run failed with status: ${runStatus.status}`,
          );
        }

        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(
          currentThreadId as any,
        );
        const assistantMessage = messages.data.find(
          (msg) => msg.role === "assistant",
        );

        if (!assistantMessage || !assistantMessage.content[0]) {
          throw new Error("No response from Assistant");
        }

        const responseContent =
          assistantMessage.content[0].type === "text"
            ? assistantMessage.content[0].text.value
            : "";

        if (!responseContent) {
          throw new Error("Empty response from Assistant");
        }

        const chatResponse: ChatResponse = {
          message: responseContent,
          threadId: currentThreadId,
          timestamp: Date.now(),
        };

        res.json(chatResponse);
      } catch (assistantError) {
        console.log(
          "Assistant API failed, falling back to Chat Completions:",
          assistantError,
        );

        // Fall back to Chat Completions API
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful fitness and health assistant specializing in VO2Max training and cardiovascular fitness. You are part of a VO2Max improvement app that helps users create personalized training plans. Provide helpful, accurate, and encouraging advice about fitness, training, nutrition, recovery, and health. Keep responses concise but informative. When users ask about training plans, you can mention that they can use the main app feature to get detailed personalized plans.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const responseContent = completion.choices[0]?.message?.content || "";

        if (!responseContent) {
          throw new Error("Empty response from OpenAI");
        }

        const chatResponse: ChatResponse = {
          message: responseContent,
          threadId: currentThreadId || `fallback-${Date.now()}`,
          timestamp: Date.now(),
        };

        res.json(chatResponse);
      }
    } else {
      // Use Chat Completions API if no Assistant ID
      console.log("Using Chat Completions API for chat...");

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful fitness and health assistant specializing in VO2Max training and cardiovascular fitness. You are part of a VO2Max improvement app that helps users create personalized training plans. Provide helpful, accurate, and encouraging advice about fitness, training, nutrition, recovery, and health. Keep responses concise but informative. When users ask about training plans, you can mention that they can use the main app feature to get detailed personalized plans.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseContent = completion.choices[0]?.message?.content || "";

      if (!responseContent) {
        throw new Error("Empty response from OpenAI");
      }

      const chatResponse: ChatResponse = {
        message: responseContent,
        threadId: currentThreadId || `chat-${Date.now()}`,
        timestamp: Date.now(),
      };

      res.json(chatResponse);
    }
  } catch (error) {
    console.error("Error in chat endpoint:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return res.status(401).json({ error: "Invalid OpenAI API key" });
      }
      if (error.message.includes("quota") || error.message.includes("rate")) {
        return res
          .status(429)
          .json({ error: "API quota exceeded or rate limited" });
      }
    }

    res.status(500).json({
      error: "Failed to process chat message. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
