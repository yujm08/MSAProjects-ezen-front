'use client';

import React, { useState, useEffect } from 'react';
import { getCommentsByPost, createComment, deleteComment } from '@/lib/apis/comment';

interface Comment {
  id: number;
  userId: string;
  content: string;
  createdAt: string;
}

interface Props {
  postId: string;
  userId?: string; // ✅ undefined 허용
}

export default function CommentSection({ postId, userId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await getCommentsByPost(postId);
        setComments(data);
      } catch (error) {
        console.error("댓글을 불러오는 중 오류 발생:", error);
      }
    }
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const createdComment = await createComment(userId, postId, newComment);
      setComments([...comments, createdComment]);
      setNewComment('');
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!userId) return;

    try {
      await deleteComment(commentId, userId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  return (
    <div className="comments-section">
      <h2>댓글</h2>
      {comments.length === 0 && <p>아직 댓글이 없습니다.</p>}
      {comments.map((comment) => (
        <div key={comment.id} className="comment-card">
          <p>{comment.content}</p>
          <span className="comment-meta">작성자 ID: {comment.userId}</span>
          
          {/* 댓글 삭제 버튼 - 댓글 작성자만 가능 */}
          {userId && userId === comment.userId && (
            <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
          )}
        </div>
      ))}

      {/* 로그인한 유저만 댓글 작성 가능 */}
      {userId ? (
        <div className="comment-input">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
          />
          <button onClick={handleCommentSubmit}>댓글 작성</button>
        </div>
      ) : (
        <p className="notice">로그인하면 댓글을 작성할 수 있습니다.</p>
      )}
    </div>
  );
}
