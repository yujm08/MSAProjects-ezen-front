// app/register/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { createUser } from '@/lib/apis/user';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1) 간단한 클라이언트 검증
    if (email.length < 2) {
      setErrorMsg('이메일은 최소 2글자 이상이어야 합니다.');
      return;
    }
    if (name.length < 2) {
      setErrorMsg('이름은 최소 2글자 이상이어야 합니다.');
      return;
    }
    if (pwd.length < 8) {
      setErrorMsg('비밀번호는 최소 8글자 이상이어야 합니다.');
      return;
    }

    try {
      // 2) 회원가입 API 호출
      const data = await createUser(email, name, pwd);
      console.log('회원가입 API 응답:', data);

      alert('회원가입 성공!');
      // 회원가입 후 로그인 페이지 등으로 이동
      window.location.href = '/login';
      // 또는 Next.js Router를 사용할 경우:
      // router.push('/login');
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
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
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
          type="text"
          placeholder="이름"
          className="border border-gray-300 p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="border border-gray-300 p-2 rounded"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
        >
          회원가입
        </button>
      </form>
    </section>
  );
}
