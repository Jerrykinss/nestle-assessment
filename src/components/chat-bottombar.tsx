"use client";

import React, { useEffect, useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { IoMdSend } from "react-icons/io";

export interface ChatBottombarProps {
}

export default function ChatBottombar({
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="p-4 flex flex-col justify-between w-full items-center">
      <div className="w-full flex flex-col relative">
        <form
          onSubmit={handleFormSubmit}
          className="w-full items-center flex relative bg-accent rounded-lg"
        >
          <div className="flex items-center w-full">
            <TextareaAutosize
              autoComplete="off"
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              value={input}
              name="message"
              placeholder="Message Nestle chatbot"
              className="max-h-48 h-16 p-4 bg-accent placeholder:text-muted-foreground focus-visible:outline-none w-full flex items-center resize-none overflow-hidden overflow-y-auto rounded-lg"
            />
            <button
              className="flex rounded-full w-8 h-8 items-center justify-center m-2"
              type="submit"
            >
              <IoMdSend className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
