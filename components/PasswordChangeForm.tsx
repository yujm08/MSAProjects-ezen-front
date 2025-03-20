'use client';

import { useState } from 'react';
import { changePassword } from '@/lib/apis/user';
import { useRouter } from 'next/navigation';

export default function PasswordChangeForm({ userId }: { userId: string }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    // 비밀번호 제약 조건 체크
    if (newPassword.length < 8) {
      alert('새로운 비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      // 비밀번호 변경 API 호출
      await changePassword(userId, oldPassword, newPassword);
      setSuccess('비밀번호 변경이 성공적으로 완료되었습니다.');
      setTimeout(() => {
        // 비밀번호 변경 후 홈 화면으로 돌아가도록 처리
        alert('비밀번호가 성공적으로 변경되었습니다.');
        router.push('/');
      }, 2000);
    } catch (err) {
      // 서버에서 발생한 오류 처리 - 모두 alert으로 표시
      if (err instanceof Error) {
        if (err.message.includes('Old password is incorrect')) {
          alert('현재 비밀번호가 틀렸습니다. 다시 확인해주세요.');
          setOldPassword(''); // 현재 비밀번호만 초기화
        } else {
          alert('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
      }
      
      // 에러 객체를 window.onerror에서 처리하지 않도록 방지
      return true;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-sm mt-20"
         onError={(e) => {
           e.preventDefault();
           e.stopPropagation();
           return true;
         }}>
      <h2 className="text-2xl font-semibold mb-6 text-center">비밀번호 변경</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-600 p-4 rounded mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="password"
          placeholder="현재 비밀번호"
          className="border border-gray-300 p-2 rounded"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="새로운 비밀번호"
          className="border border-gray-300 p-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="border border-gray-300 p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
        >
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
