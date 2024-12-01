import { Message } from "ai/react";
import React, { useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';


interface ChatListProps {}

export default function ChatList({
}: ChatListProps) {

  const messages = [
    { id: 1, role: "user", content: "Item 1" },
    { id: 2, role: "assistant", content: "Item 2" },
    { id: 3, role: "user", content: "This is a very long Item 3 in order to test the maximum size of the user message box. Here I will write some extra words to make it more clear." },
    { id: 4, role: "assistant", content: "This is a very long Item 4 in order to test the maximum size of the assistant message box. Here I will write some extra words to make it more clear." },
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
            className={`flex p-3 items-center ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end gap-3 markdown-content bg-accent rounded-lg">
              <span className="bg-accent p-3 rounded-md max-w-xl overflow-x-auto">
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
