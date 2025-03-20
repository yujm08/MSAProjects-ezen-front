import { useState } from 'react';
import { searchPosts, PostResponse } from '@/lib/apis/board';
import Board from './Board';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const results = await searchPosts(searchTerm);
        setPosts(results.content);
      } catch (error) {
        console.error("검색 오류:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 my-6 w-full">
      {/* 검색창과 버튼을 한 줄에 배치 */}
      <div className="flex items-center space-x-4 w-full">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="w-full text-lg p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleSearch}
        >
          SEARCH
        </button>
      </div>

      {/* 검색 결과를 아래로 표시, isSearchResult={true}로 전달 */}
      <Board
        posts={posts}
        loading={loading}
        searchTerm={searchTerm}
        isSearchResult={true}
      />
    </div>
  );
}
