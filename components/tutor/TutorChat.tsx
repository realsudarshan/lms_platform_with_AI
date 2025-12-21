"use client";

import { useChat } from "@ai-sdk/react";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <TutorMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="shrink-0 p-4 pt-2">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="
              relative
              w-full
              px-4 py-3 pr-14
              bg-slate-900/40 backdrop-blur-md
              border border-emerald-500/20
              rounded-xl
              text-white text-base
              placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            "
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              p-2.5
              bg-gradient-to-br from-emerald-500 to-teal-600
              hover:from-emerald-400 hover:to-teal-500
              disabled:from-slate-700 disabled:to-slate-800
              disabled:cursor-not-allowed
              rounded-lg
              shadow-lg shadow-emerald-900/20
              hover:shadow-emerald-500/40
              hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200
              group/btn
            "
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </form>
        <p className="mt-4 text-xs font-medium text-slate-500 text-center uppercase tracking-widest">
          Powered by LMS's AI • Ultra Exclusive
        </p>
      </div>
    </div>
  );
}
