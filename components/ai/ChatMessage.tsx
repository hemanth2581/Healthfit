'use client';

import React, { useState } from 'react';
import { Sparkles, User, AlertCircle, Copy, Check, RotateCw } from 'lucide-react';

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatMessageProps {
  message: MessageItem;
  isLast?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

/**
 * Code block with language tag and dedicated copy button
 */
function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-2.5 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shadow-inner text-[11px] font-mono text-left">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px]">
        <span className="uppercase tracking-wider font-semibold text-emerald-400">{lang || 'CODE'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-500/30">
        {code}
      </pre>
    </div>
  );
}

/**
 * Handles bold (**text**), links ([text](url)), inline highlights (`code`), and italic (*text*)
 */
function renderInlineMarkdown(str: string): React.ReactNode {
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = str.split(regex);

  return parts.map((part, i) => {
    // Markdown link: [Title](URL)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-700 underline underline-offset-2 hover:text-teal-900 font-medium transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-inherit">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={i} className="italic text-inherit">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-emerald-800 font-mono text-[11px] border border-slate-200">
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function FormattedTextLines({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet line
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[•\-*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-emerald-600 mt-0.5 font-bold">•</span>
              <span>{renderInlineMarkdown(content)}</span>
            </div>
          );
        }

        // Numbered list (e.g., "1. ")
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-emerald-700 font-bold">{numMatch[1]}.</span>
              <span>{renderInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }

        // Section header (e.g., "# Header", "## Header", "### Header")
        if (trimmed.startsWith('#')) {
          const headerLevel = trimmed.match(/^#+/)?.[0].length || 1;
          const headerText = trimmed.replace(/^#+\s*/, '');
          const textSize = headerLevel === 1 ? 'text-[15px]' : headerLevel === 2 ? 'text-[14px]' : 'text-[13px]';
          return (
            <div key={idx} className={`font-black text-slate-900 pt-1.5 pb-0.5 ${textSize}`}>
              {renderInlineMarkdown(headerText)}
            </div>
          );
        }

        return <p key={idx}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

/**
 * Parses fenced code blocks and regular markdown lines
 */
function FormattedContent({ text }: { text: string }) {
  if (text.includes('```')) {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <FormattedTextLines key={`text-${lastIndex}`} text={text.substring(lastIndex, match.index)} />
        );
      }
      const lang = match[1] || 'code';
      const codeContent = match[2].trimEnd();
      parts.push(
        <CodeBlock key={`code-${match.index}`} lang={lang} code={codeContent} />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <FormattedTextLines key={`text-${lastIndex}`} text={text.substring(lastIndex)} />
      );
    }

    return <div className="space-y-1 text-xs leading-relaxed">{parts}</div>;
  }

  return <FormattedTextLines text={text} />;
}

export function ChatMessage({
  message,
  isLast = false,
  onRegenerate,
  isRegenerating = false,
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 group ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser
            ? 'bg-slate-800 text-white'
            : message.isError
            ? 'bg-rose-100 text-rose-600 border border-rose-200'
            : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold shadow-emerald-600/20'
        }`}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : message.isError ? (
          <AlertCircle className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[86%] sm:max-w-[82%] rounded-2xl p-3.5 shadow-sm relative text-left ${
          isUser
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none font-medium shadow-md shadow-emerald-600/20'
            : message.isError
            ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-none font-medium'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
        }`}
      >
        <FormattedContent text={message.content} />

        {/* Action Toolbar (Copy & Regenerate for assistant) */}
        {!isUser && !message.isError && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {isLast && onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={isRegenerating}
                  className="flex items-center gap-1 hover:text-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Regenerate response"
                >
                  <RotateCw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              )}
            </div>

            <span className="font-mono text-[9px] text-slate-400">{message.timestamp}</span>
          </div>
        )}

        {isUser && (
          <div className="text-[9px] mt-1 text-right font-mono text-emerald-100/90 font-medium">
            {message.timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
