"use client";

import { MessageCircle, Sparkles, PanelRightClose } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
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
          fixed top-0 right-0 z-50
          h-full w-full sm:w-[640px] lg:w-[720px]
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div
          className="
            h-full w-full
            bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
            border-l border-cyan-500/20
            shadow-2xl shadow-black/50
            flex flex-col
          "
        >
          {/* Header */}
          <div
            className="
              flex items-center justify-between
              px-6 py-5
              bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10
              border-b border-cyan-500/20
            "
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  Learning Assistant
                </h3>
                <p className="text-sm text-cyan-300/70">
                  Ultra exclusive • AI-powered
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="
                p-2.5 rounded-xl
                text-slate-400 hover:text-white
                hover:bg-white/10
                transition-colors
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
          fixed bottom-6 right-6 z-50
          w-16 h-16
          bg-gradient-to-br from-cyan-400 to-blue-600
          hover:from-cyan-300 hover:to-blue-500
          rounded-full
          shadow-lg shadow-cyan-500/30
          hover:shadow-xl hover:shadow-cyan-500/40
          transition-all duration-300
          flex items-center justify-center
          group
          ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}
        `}
        aria-label="Open AI tutor"
      >
        <div
          className="
            absolute inset-0 rounded-full
            bg-gradient-to-br from-cyan-400 to-blue-600
            animate-ping opacity-30
          "
        />
        <MessageCircle className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
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
