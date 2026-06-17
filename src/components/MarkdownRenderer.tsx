// Markdown 渲染组件 - 用于展示 AI 返回的格式化内容
"use client";

import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-pokemon-yellow mt-5 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">{children}</li>
          ),
          code: ({ children }) => (
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-pokemon-yellow text-sm">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-pokemon-blue pl-4 py-2 my-3 bg-white/5 rounded-r">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-white/10 my-4" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
