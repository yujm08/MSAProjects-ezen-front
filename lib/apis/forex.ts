import axios from "axios";

const API_BASE_URL = "https://localhost:8443/data-collector-service/api/forex";

// 특정 기간의 환율 데이터 가져오기
export const fetchForexData = async (currencyCode: string, period: string) => {
    const response = await axios.get(`${API_BASE_URL}/${period}`, {
        params: { currencyCode },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return response.data; // { labels, datasets } 구조 반환
};

// 최신 환율 정보 가져오기 (툴팁용)
export const fetchForexSummary = async (currencyCode: string) => {
    const response = await axios.get(`${API_BASE_URL}/summary`, {
        params: { currencyCode },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return response.data; // { exchangeRate, changeRate, timestamp }
};
