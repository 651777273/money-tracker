import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Tracker",
  description: "A simple personal income and expense tracker."
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
