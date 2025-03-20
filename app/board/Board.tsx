'use client'; // 클라이언트 컴포넌트로 설정

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // next/navigation 사용
import { FileResponse, PostResponse } from '@/lib/apis/board';
import PostItem from './PostItem';
import { checkAuthStatus } from '@/lib/apis/auth'; // 로그인 상태 확인 API

interface Post {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  content: string;
  viewCount: number;
  likeCount: number;
  files: FileResponse[];
}

export default function Board({
  posts,
  loading,
  searchTerm,
  isSearchResult,
}: {
  posts: PostResponse[];
  loading: boolean;
  searchTerm: string;
  isSearchResult: boolean;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인 API 호출
    checkAuthStatus()
      .then((res) => {
        setIsLoggedIn(res.isLoggedIn);
      })
      .catch((err) => {
        console.error('[Board] checkAuthStatus error:', err);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  const convertedPosts: Post[] = posts.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    userId: post.userId,
    content: post.content,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    files: post.files,
  }));

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="bg-blue-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 게시글 작성 버튼 클릭 시 로그인 여부 확인
  const navigateToCreatePost = () => {
    if (!isLoggedIn) {
      alert('로그인 후 게시글을 작성할 수 있습니다.');
      router.push('/login'); // 로그인 페이지로 리다이렉트
      return;
    }

    // 로그인한 경우 게시글 작성 페이지로 이동
    router.push('/board/new');
  };

  return (
    <div className="space-y-4 w-full max-w-full mx-auto">
      {/* 게시글 작성 버튼 */}
      <button
        onClick={navigateToCreatePost}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600 focus:outline-none"
      >
        게시글 작성
      </button>

      {convertedPosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          highlightText={highlightText}
          searchTerm={searchTerm}
          isSearchResult={isSearchResult}
        />
      ))}
    </div>
  );
}
