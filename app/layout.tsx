import type { Metadata } from "next";
import Stage from "./_components/Stage";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOOD BOY",
  description: "A psychological horror game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {/* 全ページを 1920×1080（16:9）で描いて、ウィンドウに合わせて縮小・拡大する */}
        <Stage>{children}</Stage>
      </body>
    </html>
  );
}
