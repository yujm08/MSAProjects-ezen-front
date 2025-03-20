'use client';

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getUser } from '@/lib/apis/user';
import Link from 'next/link';  // useRouter 대신 Link 사용

interface Post {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  content: string;
}

export default function PostItem({
  post,
  highlightText,
  searchTerm,
  isSearchResult,
}: {
  post: Post;
  highlightText: (text: string, searchTerm: string) => React.ReactNode;
  searchTerm: string;
  isSearchResult: boolean;
}) {
  const [authorName, setAuthorName] = useState<string | null>(null);

  // UseEffect to fetch the author name
  useEffect(() => {
    if (post.userId) {
      getUser(post.userId)
        .then((user) => setAuthorName(user.name))
        .catch((error) => console.error("[PostItem] Error fetching user info:", error));
    }
  }, [post.userId]);

  // Date formatting
  const createdAtDate = new Date(post.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const formattedCreatedAt =
    createdAtDate.getTime() < Date.now() - 86400000
      ? createdAtDate.toISOString().slice(0, 10)
      : timeAgo;

  const updatedTime =
    post.updatedAt && post.updatedAt !== post.createdAt
      ? ` | 수정됨 ${formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}`
      : "";

  // Snippet for post content
  const contentSnippet = post.content
    ? post.content.slice(0, 80) + (post.content.length > 80 ? "..." : "")
    : "";

  // If it's a search result, format it differently
  if (isSearchResult) {
    return (
      <div className="flex justify-center w-full">
        <div className="border-b border-gray-200 pb-4 w-full max-w-3xl">
          <div className="flex flex-col">
            <Link href={`/board/${post.id}`}>
              <h3 className="text-lg font-medium text-blue-700 cursor-pointer">
                {highlightText(post.title, searchTerm)}
              </h3>
            </Link>
            <p className="text-sm text-gray-800 mt-1">{highlightText(contentSnippet, searchTerm)}</p>
            <div className="text-xs text-gray-500 mt-2">
              작성자: {authorName || "알 수 없음"} | {formattedCreatedAt}
              {updatedTime}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default post item design (non-search result)
  return (
    <div className="p-4 bg-white shadow-lg rounded-md hover:shadow-xl transition-all w-full max-w-full mb-4">
      <div className="flex flex-col">
        <Link href={`/board/${post.id}`}>
          <h3 className="text-lg font-medium cursor-pointer">
            {highlightText(post.title, searchTerm)}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">작성자: {authorName || "알 수 없음"}</p>
        <p className="text-sm text-gray-800 mt-2">{highlightText(contentSnippet, searchTerm)}</p>
        <div className="flex justify-end mt-2">
          <p className="text-xs text-gray-500">{formattedCreatedAt}{updatedTime}</p>
        </div>
      </div>
    </div>
  );
}
