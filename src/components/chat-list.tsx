import { Message } from "ai/react";
import React, { useRef, useEffect } from "react";


interface ChatListProps {}

export default function ChatList({
}: ChatListProps) {

  return (
    <div id="scroller" className="w-full overflow-y-auto overflow-x-hidden h-full justify-end">
    </div>
  );
}
