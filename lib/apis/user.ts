/**
 * API Gateway를 통해 user-service와 통신하는 모듈 (UserService 전용)
 * - 인증(로그인) 시 쿠키에 JWT를 발급받아 이후 요청에 자동 포함
 * - 모든 fetch 요청에서 credentials: 'include' 사용
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log('[user-api] BASE_URL:', BASE_URL);

/**
 * 1) 로그인
 * - POST /login (Gateway에서 /user-service/login → user-service의 로그인 처리)
 * - 성공 시 서버에서 JWT 쿠키(accessToken, refreshToken) 발급
 */
export async function login(email: string, password: string) {
  console.log('[user-api/login] Sending POST /user-service/login request');

  const response = await fetch(`${BASE_URL}/user-service/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  console.log('[user-api/login] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[user-api/login] Error:', errorText);
    throw new Error('로그인 실패: ' + errorText);
  }

  const data = await response.text();
  console.log('[user-api/login] Success - Response Body:', data);
  return data;
}

/**
 * 2) 회원가입
 * - POST /users
 * - 요청 바디: { email, name, pwd } (서버의 RequestUser DTO와 일치)
 */
export async function createUser(email: string, name: string, pwd: string) {
  console.log('[user-api/createUser] Sending POST /user-service/users request');

  const response = await fetch(`${BASE_URL}/user-service/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, pwd }),
    credentials: 'include',
  });

  console.log('[user-api/createUser] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[user-api/createUser] Error:', errorText);
    throw new Error('회원가입 실패: ' + errorText);
  }

  const data = await response.json();
  console.log('[user-api/createUser] Success - Response Body:', data);
  return data;
}

/**
 * 3) 전체 사용자 조회
 * - GET /users
 * - JWT 쿠키가 필요함 (Security 설정에 따라)
 */
export async function getUsers() {
  console.log('[user-api/getUsers] Sending GET /user-service/users request');

  const response = await fetch(`${BASE_URL}/user-service/users`, {
    method: 'GET',
    credentials: 'include',
  });

  console.log('[user-api/getUsers] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[user-api/getUsers] Error:', errorText);
    throw new Error('사용자 목록 조회 실패: ' + errorText);
  }

  const data = await response.json();
  console.log('[user-api/getUsers] Success - Response Body:', data);
  return data;
}

/**
 * 4) 특정 사용자 조회
 * - GET /users/{userId}
 */
export async function getUser(userId: string) {
  console.log(`[user-api/getUser] Sending GET /user-service/users/${userId} request`);

  const response = await fetch(`${BASE_URL}/user-service/users/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });

  console.log('[user-api/getUser] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[user-api/getUser] Error:', errorText);
    throw new Error('사용자 조회 실패: ' + errorText);
  }

  const data = await response.json();
  console.log('[user-api/getUser] Success - Response Body:', data);
  return data;
}

/**
 * 5) 비밀번호 변경
 * - PATCH /users/{userId}/password
 * - 요청 바디: { oldPassword, newPassword }
 */
export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  console.log(`[user-api/changePassword] Sending PATCH /user-service/users/${userId}/password request`);

  const response = await fetch(`${BASE_URL}/user-service/users/${userId}/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword }),
    credentials: 'include',
  });

  console.log('[user-api/changePassword] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[user-api/changePassword] Error:', errorText);
    throw new Error('비밀번호 변경 실패: ' + errorText);
  }

  const data = await response.text();
  console.log('[user-api/changePassword] Success - Response Body:', data);
  return data || '비밀번호 변경 성공';
}
