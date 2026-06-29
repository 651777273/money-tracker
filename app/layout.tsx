import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "记账追踪",
  description: "一个简单的个人收支记录工具。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
