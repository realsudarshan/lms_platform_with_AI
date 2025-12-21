"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, type FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { TutorMessages } from "./TutorMessages";

export function TutorChat() {
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hey! 👋 I'm your personal learning assistant. Tell me what you'd like to learn, and I'll find the perfect courses for you.",
          },
        ],
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    sendMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        <TutorMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="shrink-0 p-6 border-t border-cyan-500/20 bg-slate-900/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What would you like to learn?"
            disabled={isLoading}
            className="
              w-full
              px-5 py-4 pr-14
              bg-white/5
              border border-cyan-500/20
              rounded-xl
              text-white text-base
              placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
            "
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              p-2.5
              bg-gradient-to-r from-cyan-500 to-blue-600
              hover:from-cyan-400 hover:to-blue-500
              disabled:from-slate-600 disabled:to-slate-700
              disabled:cursor-not-allowed
              rounded-lg
              transition-all duration-200
              group
            "
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </form>
        <p className="mt-3 text-sm text-slate-500 text-center">
          Powered by AI • Ultra exclusive feature
        </p>
      </div>
    </div>
  );
}
