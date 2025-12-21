"use client";

import { useAuth } from "@clerk/nextjs";
import { MessageCircle, PanelRightClose, Sparkles } from "lucide-react";
import { TutorChat } from "./TutorChat";
import { TutorProvider, useTutor } from "./TutorContext";

function TutorPanel() {
  const { isOpen, closeChat, toggleChat } = useTutor();

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close chat"
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 cursor-default
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeChat}
      />

      {/* Slide-out Panel */}
      <div
        className={`
          fixed top-8 bottom-8 right-8 z-50
          w-[calc(100%-64px)] sm:w-[400px] lg:w-[450px]
          transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-12 opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div
          className="
            h-full w-full
            bg-slate-900/60 backdrop-blur-xl
            border border-emerald-500/20
            shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)]
            rounded-3xl
            flex flex-col
            overflow-hidden
          "
        >
          {/* Header */}
          <div
            className="
              flex items-center justify-between
              px-6 py-4
              bg-emerald-500/5
              border-b border-emerald-500/10
            "
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-[3px] border-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">
                  AI Tutor
                </h3>
                <p className="text-xs font-medium text-emerald-400/80">
                  Ultra Exclusive • Always Online
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="
                p-2 rounded-xl
                text-slate-400 hover:text-white
                hover:bg-emerald-500/10
                transition-all duration-200
              "
              aria-label="Close chat"
            >
              <PanelRightClose className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Content - Takes remaining space */}
          <div className="flex-1 overflow-hidden">
            <TutorChat />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={toggleChat}
        className={`
          fixed bottom-8 right-8 z-50
          w-20 h-20
          bg-gradient-to-br from-emerald-400 to-teal-600
          hover:from-emerald-300 hover:to-teal-500
          rounded-[2rem]
          shadow-[0_20px_50px_-12px_rgba(16,185,129,0.5)]
          hover:shadow-[0_25px_60px_-12px_rgba(16,185,129,0.6)]
          hover:-translate-y-1
          transition-all duration-300
          flex items-center justify-center
          group
          ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}
        `}
        aria-label="Open AI tutor"
      >
        <div
          className="
            absolute inset-0 rounded-[2rem]
            bg-emerald-400
            animate-ping opacity-20
          "
        />
        <MessageCircle className="w-9 h-9 text-white transition-transform group-hover:scale-110" />
      </button>
    </>
  );
}

export function TutorWidget() {
  const { isLoaded, has } = useAuth();

  // Wait for Clerk to load
  if (!isLoaded) {
    return null;
  }

  // Only show widget for Ultra members
  const isUltra = has?.({ plan: "ultra" });
  if (!isUltra) {
    return null;
  }

  return (
    <TutorProvider>
      <TutorPanel />
    </TutorProvider>
  );
}
