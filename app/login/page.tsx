// app/login/page.tsx
'use client';
import { FormEvent, useState } from 'react';
import { login } from '@/lib/apis/user';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await login(email, password);
      alert('로그인 성공!');
      window.location.href = '/';
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded shadow-sm">
    <h2 className="text-2xl font-bold mb-4">로그인</h2>
    {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="email"
        placeholder="이메일"
        className="border border-gray-300 p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="border border-gray-300 p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
      >
        로그인
      </button>
    </form>

    {/* 회원가입 링크 (아직 회원이 아니라면 가입 유도) */}
    <p className="text-sm text-gray-500 mt-4">
      아직 회원이 아니신가요?{' '}
      <Link href="/register" className="text-blue-600 hover:underline">
        회원가입
      </Link>
    </p>
  </section>
  );
}
