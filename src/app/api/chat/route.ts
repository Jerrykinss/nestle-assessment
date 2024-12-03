import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";

let cachedURLs: any = null;

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
    throw new Error("Error fetching URLs");
  }
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);
  const URLs = await getURLs(req);

  const systemPrompt = `You are Nestle's AI Chatbot, designed to help answer user queries related to Nestle. 
  In order to answer queries correctly and assist in a helpful manner, you must use information directly found on Nestle's webpages. 
  You will be provided with a list of URLs to different pages on Nestle's website. 
  You must use the tool call 'fetchPageContents' with one of the URLs provided to retrieve the contents of this page. 
  Make a judgement decision on which page to access to provide you with the necessary information to make informed replies, and tell the user each time which page was accessed. 
  For example, to answer a request to learn more about Aero products, you may wish to visit https://www.madewithnestle.ca/aero. 
  To suggest a recipe, you may go to https://www.madewithnestle.ca/recipes to see which recipes are available. 
  For a specific recipe in mind, you may try something like https://www.madewithnestle.ca/recipe/green-monster-smoothie or another recipe that aligns with what the user is searching for.
  Overall help may be in https://www.madewithnestle.ca/help. 
  To tell the user about Nestle, you may try https://www.madewithnestle.ca/about-us.
  Similarly, choose URLs accordingly.
  Remember, word your responses as if you are a part of Nestle. For example, do not say you found something from Nestle's website, say it objectively like this is what is on the website.
  Do not answer queries that may be unrelated to Nestle.
  The following is the list of URLs:
  \n${JSON.stringify(URLs, null, 2)}`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    tools: {
      fetchPageContents: {
        description:
          "Provided a URL, fetches the text contents of the page. Upon return, when answering use query with text results, the AI should mention the URL that was accessed.",
        parameters: z.object({ url: z.string() }),
      },
    },
  });

  return result.toDataStreamResponse();
}