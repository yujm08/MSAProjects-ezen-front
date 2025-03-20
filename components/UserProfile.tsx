'use client';

import { useState, useEffect } from 'react';
import { getUser } from '@/lib/apis/user';
import { checkAuthStatus } from '@/lib/apis/auth';
import { useRouter } from 'next/navigation'; // Next.js 라우터 import

// UserInfo 타입 정의
interface UserInfo {
  name: string;
  email: string;
}

export default function UserProfile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);  // 타입 정의
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter(); // useRouter 훅을 사용하여 라우팅을 처리

  // 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus()
      .then((res) => {
        if (res.isLoggedIn) {
          setIsLoggedIn(true);
          fetchUserInfo(res.userId);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        console.error('[UserProfile] checkAuthStatus error:', err);
        setError('로그인 상태 확인 중 오류');
      });
  }, []);

  // 사용자 정보 조회
  const fetchUserInfo = async (userId: string) => {
    try {
      const data = await getUser(userId);  // 기존 getUser 함수 사용
      setUserInfo(data);
    } catch (err) {
      console.error('[UserProfile] getUser error:', err);
      setError('사용자 정보 로딩 실패');
    }
  };

  // 비밀번호 변경 페이지로 이동하는 함수
  const handleChangePassword = () => {
    setShowDropdown(false); // 드롭다운 메뉴 닫기
    router.push('/user-info'); // 비밀번호 변경 페이지로 이동
  };

  return (
    <div className="relative">
      <div className="flex items-center cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>
      </div>
      {showDropdown && isLoggedIn && userInfo && (
        <div className="absolute right-0 bg-white shadow-lg p-5 rounded mt-2 w-60">
          <div className="text-center text-xl font-semibold text-black mb-2">{userInfo.name}</div>
          <div className="text-center text-sm text-gray-500">{userInfo.email}</div>
          <div className="mt-4">
            <button
              className="w-full bg-gray-800 text-white p-2 rounded text-sm"
              onClick={handleChangePassword}
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
