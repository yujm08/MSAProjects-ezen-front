'use client'; // 클라이언트 컴포넌트로 설정

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // next/navigation 사용
import { createPosts } from '@/lib/apis/board';

export default function NewPostPage() {
  const router = useRouter(); // router 사용
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);  // 파일을 FileList로 저장
    }
  };


  // 게시글 작성 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await createPosts(title, content, files);
      console.log('게시글 작성 성공', response);
      alert('게시글이 작성되었습니다.');
      router.push('/board'); // 게시글 목록 페이지로 이동
    } catch (error) {
      console.error('게시글 작성 실패', error);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-lg font-medium">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="내용을 입력하세요"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="files" className="block text-lg font-medium">
            파일 업로드
          </label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900"
          >
            {loading ? '게시글 작성 중...' : '게시글 작성'}
          </button>
        </div>
      </form>
    </div>
  );
}
