import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";


export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `You are Nestle AI Chatbot. Respond to the user and answer questions accordingly.`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: convertToCoreMessages(messages)
  });

  return result.toDataStreamResponse();
}