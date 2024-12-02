import { Message } from "ai/react";
import React, { useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

interface ChatListProps {
  messages: Message[];
}

export default function ChatList({
  messages,
}: ChatListProps) {

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div id="scroller" className="w-full overflow-y-auto overflow-x-hidden h-full justify-end mt-4 p-1">
      <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden justify-end my-4">
        {messages
          .filter((message) => message.content && message.content.trim() !== "")
          .map((message, index) => (
          <div
          key={message.id || index}
          className={`flex p-3 items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className="flex flex-col items-start gap-2 bg-accent rounded-lg p-3 max-w-xl">
            <p className="text-sm font-bold">{message.role === "user" ? "User" : "Nestle AI"}</p>
            <span className="markdown-content">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </span>
          </div>
        </div>
        ))}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
