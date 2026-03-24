import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "돼지고기 부위 가이드",
  description: "돼지고기 부위를 쉽게 고르는 Next.js 사이트"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
