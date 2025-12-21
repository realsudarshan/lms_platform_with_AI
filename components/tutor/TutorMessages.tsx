"use client";

import type { UIMessage } from "ai";
import { CheckCircle2, Loader2, Search, Sparkles, User } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { useTutor } from "./TutorContext";

interface TutorMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

// Type for tool parts (tool-{toolName} format from AI SDK 6)
// Based on https://v6.ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling
interface ToolCallPart {
  type: string; // e.g., "tool-searchCourses"
  toolName?: string;
  toolCallId?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  output?: unknown;
  state?: "partial-call" | "call" | "result";
}

// Extract text content from message parts
function getMessageText(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) {
    return "";
  }

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("\n");
}

// Check if message has tool calls (parts starting with "tool-")
function getToolParts(message: UIMessage): ToolCallPart[] {
  if (!message.parts || message.parts.length === 0) {
    return [];
  }

  return message.parts
    .filter((part) => part.type.startsWith("tool-"))
    .map((part) => part as unknown as ToolCallPart);
}

// Get human-readable tool name
function getToolDisplayName(toolName: string): string {
  const toolNames: Record<string, string> = {
    searchCourses: "Searching courses",
  };
  return toolNames[toolName] || toolName;
}

export function TutorMessages({ messages, isLoading }: TutorMessagesProps) {
  return (
    <>
      {messages.map((message) => {
        const content = getMessageText(message);
        const toolParts = getToolParts(message);
        const hasContent = content.length > 0;
        const hasTools = toolParts.length > 0;

        // Skip if no content and no tools
        if (!hasContent && !hasTools) return null;

        return (
          <div key={message.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tool call indicators */}
            {hasTools &&
              toolParts.map((toolPart, idx) => (
                <ToolCallUI
                  key={`tool-${message.id}-${idx}`}
                  toolPart={toolPart}
                />
              ))}

            {/* Message content */}
            {hasContent && (
              <div
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`
                    shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
                    ${message.role === "assistant"
                      ? "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/20"
                      : "bg-gradient-to-br from-slate-700 to-slate-800 shadow-slate-900/20"
                    }
                  `}
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`
                    max-w-[85%] px-6 py-5 rounded-[2rem] text-lg leading-relaxed shadow-sm backdrop-blur-md border
                    ${message.role === "assistant"
                      ? "bg-white/10 text-slate-200 border-white/10 rounded-tl-sm"
                      : "bg-emerald-500/10 text-white border-emerald-500/20 rounded-tr-sm"
                    }
                  `}
                >
                  <MessageContent content={content} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Loading indicator */}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex gap-4 animate-in fade-in duration-500">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 rounded-[2rem] rounded-tl-sm">
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Tool call UI component
function ToolCallUI({ toolPart }: { toolPart: ToolCallPart }) {
  // Extract tool name from type (e.g., "tool-searchCourses" -> "searchCourses")
  const toolName = toolPart.toolName || toolPart.type.replace("tool-", "");
  const displayName = getToolDisplayName(toolName);

  // Debug: log tool part structure to understand the format
  console.log("Tool part:", JSON.stringify(toolPart, null, 2));

  // Check multiple indicators for completion:
  // - state === "result" (AI SDK 6 state machine)
  // - result !== undefined (has result data)
  // - output !== undefined (alternative result property)
  // - Check if any property contains result-like data
  const isComplete =
    toolPart.state === "result" ||
    toolPart.result !== undefined ||
    toolPart.output !== undefined ||
    Object.keys(toolPart).some(
      (key) =>
        key.toLowerCase().includes("result") ||
        key.toLowerCase().includes("output"),
    );

  const searchQuery =
    toolName === "searchCourses" && toolPart.args?.query
      ? String(toolPart.args.query)
      : undefined;

  return (
    <div className="flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <Search className="w-6 h-6 text-white" />
      </div>
      <div
        className={`
        flex items-center gap-4 px-6 py-4 rounded-2xl text-lg backdrop-blur-md border
        ${isComplete ? "bg-emerald-500/10 border-emerald-500/20" : "bg-slate-800/40 border-white/5"}
      `}
      >
        {isComplete ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
        ) : (
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin shrink-0" />
        )}
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight ${isComplete ? "text-emerald-300" : "text-slate-300"}`}
          >
            {isComplete ? `${displayName} complete` : `${displayName}...`}
          </span>
          {searchQuery && (
            <span className="text-sm font-medium text-slate-400">
              Query: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const { closeChat } = useTutor();

  return (
    <Markdown
      components={{
        // Custom link renderer - closes chat on internal links
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;

          const isInternalLink = href.startsWith("/");

          if (isInternalLink) {
            return (
              <Link
                href={href}
                onClick={closeChat}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-400 transition-all"
              >
                {children}
              </Link>
            );
          }

          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-400 transition-all"
            >
              {children}
            </a>
          );
        },
        // Styled paragraphs
        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        // Styled headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 text-white tracking-tight">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3 text-white tracking-tight">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mb-2 text-white tracking-tight">
            {children}
          </h3>
        ),
        // Styled lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 space-y-2 mt-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 mt-2">
            {children}
          </ol>
        ),
        li: ({ children }) => {
          // Skip empty list items
          if (!children || (typeof children === "string" && !children.trim())) {
            return null;
          }
          return <li className="text-slate-200 pl-2">{children}</li>;
        },
        // Styled code
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-sm font-mono border border-emerald-500/20">
                {children}
              </code>
            );
          }
          return <code className={className}>{children}</code>;
        },
        // Styled code blocks
        pre: ({ children }) => (
          <pre className="p-5 rounded-2xl bg-slate-950/50 backdrop-blur-sm border border-white/5 overflow-x-auto mb-4 text-sm font-mono shadow-inner">
            {children}
          </pre>
        ),
        // Styled blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-emerald-500/40 pl-5 italic text-slate-300 mb-4 bg-emerald-500/5 py-2 rounded-r-lg">
            {children}
          </blockquote>
        ),
        // Styled bold/strong
        strong: ({ children }) => (
          <strong className="font-bold text-white">{children}</strong>
        ),
        // Styled emphasis/italic
        em: ({ children }) => (
          <em className="italic text-slate-300">{children}</em>
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
