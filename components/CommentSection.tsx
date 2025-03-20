import React, { useState, useEffect } from 'react';
import { getCommentsByPost, createComment, updateComment, deleteComment } from '@/lib/apis/comment';

interface Comment {
  id: number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface CommentSectionProps {
  postId: string;
  userId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [editingComment, setEditingComment] = useState<number | null>(null); // 수정 중인 댓글 ID
  const [editContent, setEditContent] = useState<string>(''); // 수정할 내용

  useEffect(() => {
    getCommentsByPost(postId)
      .then(setComments)
      .catch((error) => console.error("❌ 댓글을 불러오는 중 오류 발생:", error));
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !userId) return;

    try {
      const response = await createComment(userId, postId, newComment);
      setComments([...comments, response]);
      setNewComment('');
    } catch (error) {
      console.error("❌ Error creating comment:", error);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      const response = await updateComment(commentId, userId!, editContent);
      setComments(comments.map((c) => (c.id === commentId ? response : c)));
      setEditingComment(null);
    } catch (error) {
      console.error("❌ Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId, userId!);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("❌ Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">댓글</h2>

      {userId && (
        <div className="flex flex-col space-y-2">
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gray-800"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요"
          />
          <button onClick={handleAddComment} className="self-end px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition">
            댓글 작성
          </button>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 border rounded-md bg-gray-50">
            {editingComment === comment.id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button onClick={() => handleUpdateComment(comment.id)} className="px-3 py-1 bg-blue-600 text-white rounded-md">
                  저장
                </button>
                <button onClick={() => setEditingComment(null)} className="px-3 py-1 text-gray-600">
                  취소
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700">{comment.content}</p>
                <div className="flex justify-between text-gray-500 text-xs mt-2">
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  {userId === comment.userId && (
                    <div className="flex space-x-2">
                      <button onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }} className="text-blue-600 hover:underline">
                        수정
                      </button>
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-red-600 hover:underline">
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
