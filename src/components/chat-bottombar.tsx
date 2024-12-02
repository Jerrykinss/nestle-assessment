"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { IoMdSend } from "react-icons/io";
import { ChatRequestOptions } from "ai";

export interface ChatBottombarProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
}

export default function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="p-4 w-full flex flex-col justify-between items-center relative">
      <form
        onSubmit={handleSubmit}
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
            disabled={isLoading}
          >
            <IoMdSend className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}
