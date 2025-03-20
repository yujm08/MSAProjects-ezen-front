import axios from "axios";

// PostResponse 타입을 정의
interface PostResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = 'http://127.0.0.1:8082/api/posts';

// 로그인된 사용자의 userId를 얻어오는 함수 (예시: JWT 토큰에서 얻기)
const getUserIdFromAuth = async (): Promise<string | null> => {
  const { isLoggedIn, userId } = await checkAuthStatus();
  return isLoggedIn ? userId : null; // 로그인된 경우 userId 반환, 아니면 null
};

// 게시글 작성
export const createPosts = async (title: string, content: string): Promise<PostResponse> => { // 반환 타입을 PostResponse로 수정
  try {
    const userId = await getUserIdFromAuth();
    if (!userId) throw new Error('User not logged in.');

    console.log(`[createPosts] Request: ${API_URL}, Params: userId=${userId}, title=${title}, content=${content}`);
    const response = await axios.post(
      `${API_URL}`,
      { title, content },
      { params: { userId } }
    );
    console.log('[createPosts] Response:', response.data);
    return response.data; // 반환 타입에 맞는 데이터 반환
  } catch (error) {
    console.error("[createPosts] Error:", error);
    throw error;
  }
};

// 게시글 검색
export const searchPosts = async (
  keyword: string,
  page: number = 0,
  size: number = 10
): Promise<PostResponse[]> => { // 반환 타입을 PostResponse[]로 수정
  try {
    console.log(`[searchPosts] Request: ${API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`);
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword, page, size }
    });
    console.log('[searchPosts] Response:', response.data);
    return response.data; // 반환 타입에 맞는 데이터 반환
  } catch (error) {
    console.error("[searchPosts] Error:", error);
    throw error;
  }
};

// 로그인 확인 함수 (checkAuthStatus)
export async function checkAuthStatus() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/users/me`;

  console.log("로그인 확인 API 요청 URL:", apiUrl);

  const res = await fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    console.log("인증 실패, 로그인 안 됨");
    return { isLoggedIn: false };
  }

  const data = await res.json();
  console.log("인증 성공, 유저 ID:", data.userId);

  return { isLoggedIn: true, userId: data.userId };
}

// 로그아웃 함수
export async function logout() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/logout`;
  console.log("로그아웃 API 요청 URL:", apiUrl);

  const res = await fetch(
    apiUrl,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error('로그아웃 실패');
  }
}
