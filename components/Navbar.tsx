'use client';

// app/components/Navbar.tsx
import React from 'react';
import dynamic from 'next/dynamic';

// react-scroll의 Link 컴포넌트를 클라이언트에서만 동적으로 로드
const ScrollLink = dynamic(() => import('react-scroll').then(mod => mod.Link), { ssr: false });

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white py-4 fixed bottom-0 left-0 w-full">
      <div className="container mx-auto flex justify-around">
        {/* Smooth scroll with react-scroll */}
        <ScrollLink to="currency" smooth={true} duration={500} className="hover:text-gray-300">
          Currency
        </ScrollLink>
        <ScrollLink to="korean-stocks" smooth={true} duration={500} className="hover:text-gray-300">
          Korean Stocks
        </ScrollLink>
        <ScrollLink to="global-stocks" smooth={true} duration={500} className="hover:text-gray-300">
          Global Stocks
        </ScrollLink>
        <ScrollLink to="board" smooth={true} duration={500} className="hover:text-gray-300">
          Board
        </ScrollLink>
      </div>
    </nav>
  );
}
