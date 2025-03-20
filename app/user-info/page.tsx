'use client';

import { useEffect, useState } from 'react';
import { checkAuthStatus } from '@/lib/apis/auth'; // 로그인 상태 확인
import PasswordChangeForm from '@/components/PasswordChangeForm'; // 비밀번호 변경 폼 컴포넌트
import { useRouter } from 'next/navigation';

export default function UserInfoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState(''); // error 상태 추가
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태 확인
    checkAuthStatus()
      .then((res) => {
        if (res.isLoggedIn) {
          setIsLoggedIn(true);
          setUserId(res.userId);
        } else {
          setIsLoggedIn(false);
          setShowModal(true); // 로그인하지 않은 경우 모달을 띄움
        }
      })
      .catch((err) => {
        console.error('[UserInfoPage] checkAuthStatus error:', err);
        setError('로그인 상태 확인 중 오류'); // 오류 메시지 설정
      });
  }, []);

  // 로그인 하지 않은 경우 모달을 닫고 로그인 페이지로 이동
  const handleModalClose = () => {
    setShowModal(false);
    router.push('/login');
  };

  if (!isLoggedIn) {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto space-y-4">
              <h2 className="text-2xl font-medium text-center text-gray-900">
                로그인 후 사용 가능합니다.
              </h2>
              <p className="text-sm text-center text-gray-500">
                Please log in to continue using the service.
              </p>
              <button
                onClick={handleModalClose}
                className="w-full bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center min-h-screen">
      <div className="w-full max-w-md mt-10">
        {userId && <PasswordChangeForm userId={userId} />}
      </div>

      {/* 오류가 있는 경우에만 오류 메시지 표시 */}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
