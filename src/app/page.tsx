"use client";

import ChatList from "@/components/chat-list";
import ChatBottombar from "@/components/chat-bottombar";
import { useChat } from "ai/react";
import React, { useEffect } from "react";

export default function Home() {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "fetchPageContents") {
        return fetchPageContents(toolCall);
      }
    }
  });

  useEffect(() => {
    setMessages([
      { id: "1", role: "assistant", content: "Hi there! I'm Nestle's AI Chatbot. How can I help you today?" }
    ]);
  }, []);

  const fetchPageContents = async (toolCall: any) => {
    try {
        const url = toolCall.args.url;
        console.log(`Fetching page contents for URL: ${url}`);

        const response = await fetch(`/api/getContents?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error || 'Unknown error'}`);
        }

        const { text_content } = await response.json();
        return `Provided is the text contents for the webpage. 
        Respond to user and answer their query using this, and make sure to tell the user which URL you visited.
        Do not use anchor text when displaying URLs, show the whole link.
        If the webpage did not contain the information you were searching, tell the user which URL you checked and that there was no information on it that could answer the query.
        If the required information is likely on another webpage, and you wish to check it next, ask the user if they would want to keep searching.
        \n\n${text_content}`;
    } catch (error) {
        console.error('Error fetching page contents:', error);
        return `Failed to fetch page contents: ${error}`;
    }
  };


  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <div className="relative flex flex-col justify-between h-full w-full bg-[url('/Nestle%20Webpage%20Screenshot.png')]">
        <div className="flex flex-col justify-between w-full max-w-4xl h-full max-h-[calc(100%-2rem)] mx-auto my-4 border-2 border-black bg-white bg-opacity-95 rounded-3xl">
          <ChatList messages={messages} />
          <ChatBottombar
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}