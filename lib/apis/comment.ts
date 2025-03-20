import axios from 'axios';

const COMMENT_API_URL = 'http://127.0.0.1:8082/api/comments';

// 게시글의 댓글 가져오기
export const getCommentsByPost = async (postId: string) => {
  try {
    const response = await axios.get(`${COMMENT_API_URL}/post/${postId}`, {
      withCredentials: false, // 인증 없이 요청 가능
    });
    return response.data;
  } catch (error) {
    console.error(`[getCommentsByPost] Error:`, error);
    throw error;
  }
};

// 댓글 작성
export const createComment = async (userId: string, postId: string, content: string) => {
  try {
    const response = await axios.post(
      `${COMMENT_API_URL}`,
      {
        postId: parseInt(postId, 10),  // Convert string to number and include in request body
        content,
        parentCommentId: null  // Include this if it's part of the CommentRequest DTO
      },
      { 
        params: { userId }  // Only userId remains as a query parameter
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (commentId: number, userId: string, content: string) => {
  try {
    const response = await axios.put(`${COMMENT_API_URL}/${commentId}`, { content }, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating comment:", error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (commentId: number, userId: string) => {
  try {
    await axios.delete(`${COMMENT_API_URL}/${commentId}`, { params: { userId } });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    throw error;
  }
};
