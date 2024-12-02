import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";

let cachedURLs: any = {};

const getURLs = async (req: Request) => {
  if (cachedURLs) {
    return cachedURLs;
  }

  const host = req.headers.get('host');
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const response = await fetch(`${protocol}://${host}/api/getURLs`);

  if (response.ok) {
    cachedURLs = await response.json();
    return cachedURLs;
  } else {
    console.error("Failed to fetch URLs");
    return { "URLs": "Error fetching URLs" };
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const URLs = await getURLs(req);

  const systemPrompt = `You are Nestle's AI Chatbot, designed to help answer user queries related to Nestle. In order to retrieve data necessary to answer queries, you will be provided with a list of URLs to different pages on Nestle's website. You must use the tool call 'fetchPageContents' with one of the URLs provided to retrieve the contents of this page. Make a judgement decision on which page to access to provide you with the necessary information to make informed replies, and tell the user each time which page was accessed. The following is the list of URLs:\n${JSON.stringify(URLs, null, 2)}`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    tools: {
      fetchPageContents: {
        description:
          "Provided a URL, fetches the HTML contents of the page. Upon return, when answering use query with HTML results, the AI should mention the URL that was accessed.",
        parameters: z.object({ url: z.string() }),
      },
    },
  });

  return result.toDataStreamResponse();
}