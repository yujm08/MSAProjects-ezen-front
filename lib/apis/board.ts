import axios from "axios";
import { checkAuthStatus } from "./auth";

const API_URL = 'http://127.0.0.1:8082/api/posts';

// 게시글 목록 가져오기
export const getPosts = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<PageResponse<PostResponse>> => { // 타입을 Page<PostResponse>로 수정
  try {
    console.log(`[getPosts] Request: ${API_URL}?page=${page}&size=${size}&sort=${sort}`);
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}&sort=${sort}`);
    console.log('[getPosts] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("[getPosts] Error:", error);
    throw error;
  }
};

/**
 * 단일 게시글 조회 API
 * GET /api/posts/{postId}
 */
export const getPostById = async (postId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`, {
      withCredentials: false, // 인증 없이 요청 가능
    });
    return response.data;
  } catch (error) {
    console.error(`[getPostById] Error:`, error);
    throw error;
  }
};


// 게시글 작성 API 호출 (로그인 상태 확인 후)
export const createPosts = async (title: string, content: string, files: FileList | null): Promise<PostResponse> => {
  try {
    // 로그인 상태 확인
    const authStatus = await checkAuthStatus();  // checkAuthStatus()를 통해 로그인 상태 확인
    if (!authStatus.isLoggedIn) {
      // 로그인하지 않은 경우 알림 및 로그인 페이지로 리다이렉트
      alert('로그인 후 게시글을 작성할 수 있습니다.');
      window.location.href = '/login';  // 로그인 페이지로 이동
      throw new Error('User not logged in');
    }

    const userId = authStatus.userId;  // 로그인한 경우 userId 사용

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 파일이 있을 경우 formData에 추가
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: { userId },
    });

    return response.data;
  } catch (error) {
    console.error("게시글 작성에 실패했습니다:", error);
    throw new Error("게시글 작성에 실패했습니다.");
  }
};

// 게시글 검색
export const searchPosts = async (
  keyword: string,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<PostResponse>> => {
  try {
    console.log(`[searchPosts] Request: ${API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`);
    const response = await axios.get<PageResponse<PostResponse>>(`${API_URL}/search`, {
      params: { keyword, page, size }
    });
    console.log('[searchPosts] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("[searchPosts] Error:", error);
    throw error;
  }
};

// 게시글 수정
export async function updatePost(postId: number, userId: string, postData: FormData) {
  return axios.put(`${API_URL}/${postId}`, postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: { userId },
  });
}

// 게시글 삭제
export const deletePost = async (postId: number): Promise<void> => {
  try {
    const authStatus = await checkAuthStatus();
    if (!authStatus.isLoggedIn) {
      alert('로그인 후 게시글을 삭제할 수 있습니다.');
      window.location.href = '/login';
      throw new Error('User not logged in');
    }

    const userId = authStatus.userId;

    await axios.delete(`${API_URL}/${postId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error("게시글 삭제에 실패했습니다:", error);
    throw new Error("게시글 삭제에 실패했습니다.");
  }
};

// board.ts (공통 타입 정의 파일)
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PostResponse {
  id: number;
  userId: string; // UUID -> string 처리
  title: string;
  content: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  files: FileResponse[];
  likeCount: number;
}

export interface FileResponse {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}


