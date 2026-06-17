import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import CardBackground from "@/components/CardBackground";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "PokeMind - 宝可梦PTCG决策分析平台",
  description: "基于大模型的宝可梦PTCG卡组分析、对战复盘与AI陪练平台",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PokeMind",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b4cca",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <CardBackground />
        <Sidebar />
        <div className="md:ml-56 mb-16 md:mb-0">{children}</div>
        <PWARegister />
      </body>
    </html>
  );
}
