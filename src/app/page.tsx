"use client";

import ChatList from "@/components/chat-list";
import ChatBottombar from "@/components/chat-bottombar";
import { Message, useChat } from "ai/react";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <div className="relative flex h-full w-full">
        <div className="flex flex-col justify-between w-full h-full">
          <div className="flex flex-col justify-between w-full max-w-4xl h-full mx-auto overflow-hidden border-2 border-black">
            <ChatList/>
            <ChatBottombar/>
          </div>
        </div>
      </div>
    </main>
  );
}