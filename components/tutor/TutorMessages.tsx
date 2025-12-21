"use client";

import type { UIMessage } from "ai";
import { Sparkles, User, Search, Loader2, CheckCircle2 } from "lucide-react";
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
          <div key={message.id} className="space-y-3">
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
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`
                    shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                    ${
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-cyan-400 to-blue-600"
                        : "bg-gradient-to-br from-violet-500 to-fuchsia-600"
                    }
                  `}
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`
                    max-w-[85%] px-5 py-4 rounded-2xl text-base leading-relaxed
                    ${
                      message.role === "assistant"
                        ? "bg-white/5 text-slate-200 rounded-tl-sm"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white rounded-tr-sm"
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
        <div className="flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="bg-white/5 px-5 py-4 rounded-2xl rounded-tl-sm">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" />
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
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
        <Search className="w-5 h-5 text-white" />
      </div>
      <div
        className={`
        flex items-center gap-4 px-5 py-3.5 rounded-xl text-base
        ${isComplete ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-amber-500/10 border border-amber-500/20"}
      `}
      >
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
        )}
        <div className="flex flex-col">
          <span
            className={`font-medium ${isComplete ? "text-emerald-300" : "text-amber-300"}`}
          >
            {isComplete ? `${displayName} complete` : `${displayName}...`}
          </span>
          {searchQuery && (
            <span className="text-sm text-slate-400">
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
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
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
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          );
        },
        // Styled paragraphs
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        // Styled headings
        h1: ({ children }) => (
          <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold mb-2 text-white">
            {children}
          </h3>
        ),
        // Styled lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5 mt-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5 mt-2">
            {children}
          </ol>
        ),
        li: ({ children }) => {
          // Skip empty list items
          if (!children || (typeof children === "string" && !children.trim())) {
            return null;
          }
          return <li className="text-slate-200 pl-1">{children}</li>;
        },
        // Styled code
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 rounded bg-slate-700/50 text-cyan-300 text-sm font-mono">
                {children}
              </code>
            );
          }
          return <code className={className}>{children}</code>;
        },
        // Styled code blocks
        pre: ({ children }) => (
          <pre className="p-4 rounded-lg bg-slate-800/80 overflow-x-auto mb-3 text-sm">
            {children}
          </pre>
        ),
        // Styled blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-cyan-500/50 pl-4 italic text-slate-300 mb-3">
            {children}
          </blockquote>
        ),
        // Styled bold/strong
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
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
