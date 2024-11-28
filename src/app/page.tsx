"use client";

import { ChatLayout } from "@/components/chat-layout";
import { Message, useChat } from "ai/react";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <ChatLayout/>
    </main>
  );
}