"use client";

import { useState } from "react";

interface ExportButtonProps {
  content: string;
  title: string;
  type: "report" | "decklist" | "analysis";
}

export default function ExportButton({ content, title, type }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      // 创建一个隐藏的 iframe 用于打印
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("请允许弹出窗口");
        setExporting(false);
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
              padding: 40px;
              color: #1a1a2e;
              line-height: 1.8;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #3b4cca;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 { font-size: 24px; color: #3b4cca; }
            .header .subtitle { font-size: 12px; color: #888; margin-top: 5px; }
            .content {
              font-size: 14px;
              white-space: pre-wrap;
            }
            .content h1, .content h2, .content h3 { color: #3b4cca; margin: 15px 0 8px; }
            .content strong { color: #1a1a2e; }
            .content ul, .content ol { padding-left: 20px; margin: 8px 0; }
            .content li { margin: 4px 0; }
            .footer {
              text-align: center;
              border-top: 1px solid #eee;
              padding-top: 15px;
              margin-top: 30px;
              font-size: 10px;
              color: #999;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              font-size: 120px;
              color: rgba(59,76,202,0.03);
              pointer-events: none;
              white-space: nowrap;
            }
            @media print {
              body { padding: 20px; }
              .watermark { display: block; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">PokeMind</div>
          <div class="header">
            <h1>⚡ PokeMind</h1>
            <p class="subtitle">${
              type === "report" ? "对战复盘报告" : type === "decklist" ? "卡组列表" : "分析报告"
            } · ${new Date().toLocaleDateString("zh-CN")}</p>
          </div>
          <div class="content">
            ${convertMarkdownToHTML(content)}
          </div>
          <div class="footer">
            <p>由 PokeMind 生成 · 宝可梦PTCG决策分析平台</p>
            <p>大学生创新项目 · Powered by DeepSeek</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();

      // 等待渲染完成后打印
      setTimeout(() => {
        printWindow.print();
        setExporting(false);
      }, 500);
    } catch {
      setExporting(false);
    }
  };

  // 简单 Markdown → HTML 转换
  function convertMarkdownToHTML(md: string): string {
    return md
      .replace(/### (.+)/g, "<h3>$1</h3>")
      .replace(/## (.+)/g, "<h2>$1</h2>")
      .replace(/# (.+)/g, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.+)/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, (match) => `<ul>${match}</ul>`)
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^(?!<[hul])/gm, "<p>")
      .replace(/$/gm, "</p>");
  }

  const labels = {
    report: "📄 导出复盘报告",
    decklist: "📋 导出卡组列表",
    analysis: "📊 导出分析报告",
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting || !content}
      className="w-full py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-pokemon-yellow/50 transition disabled:opacity-50 text-sm"
    >
      {exporting ? "正在导出..." : labels[type]}
    </button>
  );
}
