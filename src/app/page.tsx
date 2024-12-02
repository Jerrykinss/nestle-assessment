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
        const { url } = toolCall.parameters;
        if (!url) {
            throw new Error('URL parameter is missing');
        }

        const response = await fetch(`/api/getHTML?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error || 'Unknown error'}`);
        }

        const { html } = await response.json();
        return { html };
    } catch (error) {
        console.error('Error fetching page contents:', error);
        return { html: null };
    }
  };


  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <div className="relative flex flex-col justify-between h-full w-full bg-[url('/Nestle%20Webpage%20Screenshot.png')]">
        <div className="flex flex-col justify-between w-full max-w-4xl h-full mx-auto my-4 border-2 border-black bg-white bg-opacity-95 rounded-3xl">
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