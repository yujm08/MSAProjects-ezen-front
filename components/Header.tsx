'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkAuthStatus, logout } from '@/lib/apis/auth';
import UserProfile from './UserProfile';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 로그인 상태 확인 API 호출
    checkAuthStatus()
      .then((res) => {
        setIsLoggedIn(res.isLoggedIn);
      })
      .catch((err) => {
        console.error('[Header] checkAuthStatus error:', err);
        setError('로그인 상태 확인 중 오류');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      alert('로그아웃 되었습니다.');
      window.location.href = '/';
    } catch (err) {
      console.error('[Header] logout error:', err);
      setError('로그아웃 실패');
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* 로고 클릭 시 / 경로 이동 */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/NewOrbit로고(with텍스트)누끼.png" // public/images 폴더 내 이미지 파일
              alt="Ezen Finance"
              className="h-8 w-auto mr-2 filter invert brightness-0 cursor-pointer"
            />
          </Link>
        </div>

        {/* 로그인/로그아웃/회원가입 버튼 */}
        <div className="flex items-center space-x-2">
          {error && <span className="text-red-400 mr-4">{error}</span>}
          {isLoggedIn ? (
            <>
              <UserProfile /> {/* 사용자 아이콘 및 드롭다운 추가 */}
              <button onClick={handleLogout} className="custom-button">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-gray-600 px-3 py-1 rounded">
                로그인
              </Link>
              <Link href="/register" className="bg-gray-600 px-3 py-1 rounded">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
