import React, { useState, useEffect } from "react";
import { getPostById, updatePost } from "@/lib/apis/board";
import { useRouter } from "next/navigation";

interface PostEditFormProps {
  postId: string;
  userId: string;
}

const PostEditForm: React.FC<PostEditFormProps> = ({ postId, userId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null); // ✅ 파일 상태 추가
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await getPostById(parseInt(postId, 10));
        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error("❌ 게시글을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // ✅ 선택된 파일 저장
    }
  };

  const handleUpdatePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("userId", userId); // ✅ userId 추가

      // ✅ 파일이 선택되었을 때만 추가
      if (file) {
        formData.append("files", file);
      }

      await updatePost(parseInt(postId, 10), userId, formData);
      alert("✅ 게시글이 수정되었습니다.");
      router.push(`/board/${postId}`);
    } catch (error) {
      console.error("❌ 게시글 수정 오류:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-bold mb-4">게시글 수정</h1>
      <input
        type="text"
        className="w-full p-2 border rounded-md mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        className="w-full p-2 border rounded-md mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        rows={5}
      />
      {/* ✅ 파일 업로드 필드 추가 */}
      <input type="file" onChange={handleFileChange} className="mb-3" />
      <div className="flex justify-end space-x-2">
        <button onClick={() => router.push(`/board/${postId}`)} className="px-4 py-2 bg-gray-500 text-white rounded-md">
          취소
        </button>
        <button onClick={handleUpdatePost} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          저장
        </button>
      </div>
    </div>
  );
};

export default PostEditForm;
