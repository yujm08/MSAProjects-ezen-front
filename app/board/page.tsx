// BoardPage.tsx 파일 수정
'use client';
import { useState, useEffect } from 'react';
import Board from '../board/Board';
import SearchBar from '../board/SearchBar';
import { getPosts } from '@/lib/apis/board';
import { PostResponse } from '@/lib/apis/board';

export default function BoardPage() {
  // 배열 타입으로 명시
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const searchTerm = ""; // 검색어 상태 추가
  const isSearchResult = false; // 검색 결과 여부 상태 추가

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts(0, 10, 'createdAt,desc');
        setPosts(data.content); // ✅ data.content 사용
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Forum</h1>
      <SearchBar />
      <Board 
        posts={posts} 
        loading={loading} 
        searchTerm={searchTerm} 
        isSearchResult={isSearchResult} 
      />
    </div>
  );
}