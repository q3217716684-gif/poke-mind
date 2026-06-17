 import type { Metadata } from "next";
  import "./globals.css";
  import Sidebar from "@/components/Sidebar";
  import CardBackground from "@/components/CardBackground";
  import PWARegister from "@/components/PWARegister";

  export const metadata: Metadata = {
    title: "PokeMind - 宝可梦PTCG决策分析平台",
    description: "基于大模型的宝可梦PTCG卡组分析、对战复盘与AI陪练平台",
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="zh-CN">
        <head>
          <meta name="theme-color" content="#3b4cca" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className="min-h-screen">
          <CardBackground />
          <Sidebar />
          <div className="md:ml-56 mb-16 md:mb-0">{children}</div>
          <PWARegister />
        </body>
      </html>
    );
  }
