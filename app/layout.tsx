// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Orbit',
  description: '금융 데이터 앱',
  icons: {
    icon: '/images/NewOrbitLogo.png', // public/images 폴더에 있는 아이콘 파일 (영문 이름)
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Header /> {/* 로그인 상태에 따른 헤더 */}
        <main className="flex-1 container mx-auto p-4">{children}</main>
        <footer className="bg-gray-200 text-gray-700 p-4 text-center">
          <p>© 2025 Orbit Finance</p>
        </footer>
      </body>
    </html>
  );
}
