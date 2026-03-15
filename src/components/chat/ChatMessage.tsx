"use client";

import { useState } from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silent fail
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"
            : "bg-gradient-to-br from-fuchsia-500 to-sky-500 text-white"
        }`}
      >
        {isUser ? "You" : "AI"}
      </div>

      {/* Bubble */}
      <div className={`group relative max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${
            isUser
              ? "rounded-tr-sm bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 border border-indigo-500/30 text-white"
              : "rounded-tl-sm glass text-white/90"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Copy button — only on AI messages */}
        {!isUser && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 self-start rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/50 opacity-0 transition-all duration-150 group-hover:opacity-100 hover:border-white/20 hover:text-white/80"
            aria-label="Copy message"
          >
            <ClipboardDocumentCheckIcon className="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
