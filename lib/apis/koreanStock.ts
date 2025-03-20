const API_BASE_URL = "https://localhost:8443/data-collector-service/api/korean-stock"; // 한국 주식 API 기본 URL

/**
 * ✅ 특정 종목의 주식 데이터를 가져오는 함수 (기간별 데이터 조회)
 * @param stockCode - 종목 코드 (예: "005930", "373220")
 * @param period - 조회할 기간 ("today", "yesterday", "oneweek", "onemonth", "threemonth")
 * @returns Chart.js 형식의 데이터
 */
export async function fetchKoreanStockData(stockCode: string, period: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/${period}?stockCode=${stockCode}`);

        if (!response.ok) {
            throw new Error(`Error fetching stock data: ${response.statusText}`);
        }

        return await response.json(); // Chart.js 포맷 데이터 반환
    } catch (error) {
        console.error("fetchKoreanStockData Error:", error);
        throw error;
    }
}

/**
 * ✅ 특정 종목의 최신 주식 요약 정보를 가져오는 함수
 * @param stockCode - 종목 코드 (예: "005930", "373220")
 * @returns 종목 요약 정보 (현재가, 변동률, 최신 시간 등)
 */
export async function fetchKoreanStockSummary(stockCode: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/summary?stockCode=${stockCode}`);

        if (!response.ok) {
            throw new Error(`Error fetching stock summary: ${response.statusText}`);
        }

        return await response.json(); // 요약 정보 반환
    } catch (error) {
        console.error("fetchKoreanStockSummary Error:", error);
        throw error;
    }
}
