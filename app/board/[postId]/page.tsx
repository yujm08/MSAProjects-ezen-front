'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPostById, deletePost } from '@/lib/apis/board';
import { getUser } from '@/lib/apis/user'; // 작성자 이름 조회 API 추가
import { checkAuthStatus } from '@/lib/apis/auth';
import CommentSection from '@/components/CommentSection';

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null); // 로그인한 사용자 ID

  useEffect(() => {
    async function fetchData() {
      if (!postId) return;
      try {
        const [postData, authData] = await Promise.all([
          getPostById(parseInt(postId, 10)),
          checkAuthStatus().catch(() => ({ userId: null })),
        ]);

        setPost({ ...postData, id: postData.id.toString() });
        setUserId(authData.userId ?? null);

        // 작성자 이름 가져오기
        getUser(postData.userId)
          .then((user) => setAuthorName(user.name))
          .catch(() => setAuthorName("알 수 없음"));
      } catch (error) {
        console.error("데이터 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [postId]);

  const handleDeletePost = async () => {
    if (!post) return;
    try {
      await deletePost(parseInt(postId, 10));
      router.push('/board'); // 삭제 후 게시판 목록으로 이동
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="error">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      {/* 작성자 이름 및 작성일 표시 */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600 text-sm font-semibold">
          작성자: {authorName || "알 수 없음"}
        </span>
        <span className="text-gray-500 text-xs">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      {/* 게시글 제목 및 내용 */}
      <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {/* 작성일 및 수정일 표시 (우측 정렬) */}
      <div className="flex justify-end text-gray-500 text-xs mt-3">
        {post.updatedAt && post.updatedAt !== post.createdAt
          ? `수정됨: ${new Date(post.updatedAt).toLocaleString()}`
          : ""}
      </div>

      {/* 수정 & 삭제 버튼 - 오른쪽 하단에 더 가깝게 정렬 */}
      {userId && userId === post.userId && (
        <div className="flex justify-end items-center space-x-1 mt-3">
          <button
            onClick={() => router.push(`/board/edit/${post.id}`)}
            className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            수정
          </button>
          <button
            onClick={handleDeletePost}
            className="px-3 py-1 bg-gray-800 text-red-400 rounded-md hover:bg-gray-700 transition"
          >
            삭제
          </button>
        </div>
      )}

      {/* 구분선 추가 */}
      <div className="border-t mt-6 mb-6"></div>

      {/* 댓글 섹션 */}
      <CommentSection postId={post.id} userId={userId || undefined} />
    </div>
  );
}
