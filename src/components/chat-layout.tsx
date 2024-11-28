import React, { useState, useEffect } from "react";
import ChatList from "./chat-list";
import ChatBottombar from "./chat-bottombar";

export interface ChatProps {}

export function ChatLayout({
}: ChatProps) {

  return (
    <div className="relative flex h-full w-full">
      <div className="flex flex-col justify-between w-full max-w-4xl h-full mx-auto overflow-hidden">
        <ChatList/>
        <ChatBottombar/>
      </div>
    </div>
  );
}
