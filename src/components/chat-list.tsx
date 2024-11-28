import { Message } from "ai/react";
import React, { useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';


interface ChatListProps {}

export default function ChatList({
}: ChatListProps) {

  const messages = [
    { id: 1, role: "user", content: "Item 1" },
    { id: 2, role: "assistant", content: "Item 2" },
    { id: 3, role: "user", content: "Item 3" },
    { id: 4, role: "assistant", content: "Item 4" },
  ];

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div id="scroller" className="w-full overflow-y-auto overflow-x-hidden h-full justify-end ">
      <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden justify-end ">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex gap-3 items-center border-2 border-black ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "user" && (
              <div className="flex items-end gap-3 markdown-content ">
                <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </span>
              </div>
            )}
            {message.role === "assistant" && (
              <div className="flex items-end gap-2">
                <div className="flex flex-col gap-2 bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto markdown-content">
                  <span>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
