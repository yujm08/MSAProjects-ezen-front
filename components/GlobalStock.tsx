"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchGlobalStockData, fetchGlobalStockSummary } from "@/lib/apis/globalStock";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

// ✅ 해외 주식 목록 (NASDAQ, NYSE, HKS 포함)
const stockList = [
    { code: "TSLA", label: "테슬라", market: "NAS" },
    { code: "AAPL", label: "애플", market: "NAS" },
    { code: "NVDA", label: "엔비디아", market: "NAS" },
    { code: "MSFT", label: "마이크로소프트", market: "NAS" },
    { code: "AMZN", label: "아마존", market: "NAS" },
    { code: "GOOG", label: "구글(알파벳)", market: "NAS" },
    { code: "META", label: "메타(페이스북)", market: "NAS" },
    { code: "AMD", label: "AMD", market: "NAS" },
    { code: "NFLX", label: "넷플릭스", market: "NAS" },
    { code: "BRK/B", label: "버크셔B주", market: "NYS" },
    { code: "TSM", label: "TSMC", market: "NYS" },
    { code: "BABA", label: "알리바바", market: "NYS" },
    { code: "NIO", label: "니오(중국전기차)", market: "NYS" },
    { code: "XOM", label: "엑슨모빌", market: "NYS" },
    { code: "KO", label: "코카콜라", market: "NYS" },
    { code: "JPM", label: "JP모건", market: "NYS" },
    { code: "V", label: "비자", market: "NYS" },
    { code: "09988", label: "알리바바(홍콩)", market: "HKS" },
    { code: "09618", label: "징둥닷컴", market: "HKS" },
    { code: "00700", label: "텐센트", market: "HKS" },
];

// ✅ 기간 선택 옵션
const periods = [
    { value: "today", label: "실시간" },
    { value: "yesterday", label: "어제" },
    { value: "oneweek", label: "1주일" },
    { value: "onemonth", label: "1달" },
    { value: "threemonth", label: "3달" },
];

export interface StockChartData {
    labels: string[];
    datasets: { label: string; data: number[] }[];
}

export interface StockSummary {
    stockCode: string;
    stockName: string;
    currentPrice: number | null;
    changeRate: number | null;
    timestamp: string;
}

const GlobalStock = () => {
    const [selectedStock, setSelectedStock] = useState(stockList[0].code);
    const [selectedPeriod, setSelectedPeriod] = useState("today");
    const [stockData, setStockData] = useState<Record<string, StockChartData | null>>({});
    const [summaryData, setSummaryData] = useState<Record<string, StockSummary | null>>({});
    const [availableStocks, setAvailableStocks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 초기 로딩 시 사용 가능한 주식 확인 (선택적)
    useEffect(() => {
        const checkAvailableStocks = async () => {
            setLoading(true);
            const available: string[] = [];
            
            // 처음 5개 종목만 검사하거나 전체 종목 검사 (전체 종목 검사는 API 호출이 많아 서버 부하가 있을 수 있음)
            // const stocksToCheck = stockList.slice(0, 5); // 처음 5개만 확인하는 예시
            const stocksToCheck = stockList; // 전체 종목 확인
            
            for (const stock of stocksToCheck) {
                try {
                    const response = await fetch(`${API_BASE_URL}/summary?stockCode=${stock.code}`);
                    if (response.ok) {
                        available.push(stock.code);
                    }
                } catch (err) {
                    console.log("미사용 변수 경고" + err)// 오류 무시 - '_'를 사용하여 미사용 변수 경고 제거
                }
            }
            
            setAvailableStocks(available);
            if (available.length > 0 && !available.includes(selectedStock)) {
                setSelectedStock(available[0]);
            }
            setLoading(false);
        };
        
        // 아래 주석을 해제하면 초기 로딩 시 사용 가능한 종목을 자동으로 확인
        checkAvailableStocks();
    }, [selectedStock]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
    
                // 요약 데이터 가져오기
                try {
                    const summary = await fetchGlobalStockSummary(selectedStock);
                    setSummaryData(prev => ({ ...prev, [selectedStock]: summary }));
                } catch (err) {
                    console.log(err);
                    console.log(`Summary data not available for ${selectedStock}`);
                    setSummaryData(prev => ({ ...prev, [selectedStock]: null }));
                }
    
                // 차트 데이터 가져오기
                try {
                    const chartData = await fetchGlobalStockData(selectedStock, selectedPeriod);
                    setStockData(prev => ({ ...prev, [selectedStock]: chartData }));
                } catch (err) {
                    console.log(err);
                    console.log(`Chart data not available for ${selectedStock}`);
                    setStockData(prev => ({ ...prev, [selectedStock]: null }));
                }
            } catch (err) {
                console.log(err);
                setError("주식 데이터를 불러오는 데 실패했습니다. 네트워크 연결을 확인해주세요.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [selectedStock, selectedPeriod]); // 의존성 배열에 selectedStock 추가

    // API 함수 수정 없이 컴포넌트 수준에서 fetch를 직접 호출하는 함수
    const API_BASE_URL = "/data-collector-service/api/global-stock";

    const chartData = stockData[selectedStock]
        ? {
              labels: stockData[selectedStock]?.labels.map(timestamp => format(new Date(timestamp), "HH:mm")),
              datasets: [
                  {
                      label: selectedStock,
                      data: stockData[selectedStock]?.datasets[0].data || [],
                      borderColor: "rgb(75, 192, 192)",
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      tension: 0.3,
                      pointRadius: 3,
                      pointHoverRadius: 5,
                  },
              ],
          }
        : null;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const isDataAvailable = stockData[selectedStock] !== null || summaryData[selectedStock] !== null;
    const currentStock = stockList.find(stock => stock.code === selectedStock);

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            {/* ✅ 1. 주식 선택 버튼 */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {stockList.map(({ code, label }) => (
                    <button
                        key={code}
                        className={`px-3 py-2 rounded-md transition-colors text-sm ${
                            selectedStock === code 
                                ? "bg-blue-500 text-white font-bold" 
                                : availableStocks.length > 0 && !availableStocks.includes(code)
                                    ? "bg-gray-100 text-white cursor-not-allowed" 
                                    : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        onClick={() => setSelectedStock(code)}
                        disabled={availableStocks.length > 0 && !availableStocks.includes(code)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {!isDataAvailable ? (
                <div className="mb-6 p-8 bg-gray-50 rounded-lg text-center">
                    <p className="text-xl text-gray-500">선택한 주식({currentStock?.label})의 데이터를 사용할 수 없습니다.</p>
                    <p className="mt-2 text-gray-400">다른 주식을 선택하거나 나중에 다시 시도해주세요.</p>
                </div>
            ) : (
                <>
                    {/* ✅ 2. 요약 정보 - 가로로 정렬 */}
                    {summaryData[selectedStock] && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <div className="grid grid-cols-3 text-center">
                                <div className="p-2">
                                    <p className="text-gray-600 text-sm">현재 환율</p>
                                    <p className="text-2xl font-bold">{summaryData[selectedStock]?.currentPrice ?? "-"}</p>
                                </div>
                                <div className="p-2">
                                    <p className="text-gray-600 text-sm">변동률</p>
                                    <p className={`text-2xl font-bold ${
                                        (summaryData[selectedStock]?.changeRate || 0) > 0 ? "text-red-500" : "text-blue-500"
                                    }`}>
                                        {summaryData[selectedStock]?.changeRate ? `${summaryData[selectedStock].changeRate.toFixed(2)}%` : "-"}
                                    </p>
                                </div>
                                <div className="p-2">
                                    <p className="text-gray-600 text-sm">갱신 시간</p>
                                    <p className="text-lg">{summaryData[selectedStock]?.timestamp ? 
                                        format(new Date(summaryData[selectedStock].timestamp), "yyyy-MM-dd HH:mm") : "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ✅ 3. 차트 */}
                    <div className="bg-white p-4 rounded-md shadow-md mb-8">
                        <h3 className="text-lg font-bold mb-2">{currentStock?.label || selectedStock} 가격 변동</h3>
                        {chartData ? (
                            <div style={{ height: "300px" }}>
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: "top" },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => `가격: ${context.raw}`,
                                                    title: (tooltipItems) => `시간: ${tooltipItems[0].label}`,
                                                },
                                            },
                                        },
                                        scales: {
                                            x: {
                                                title: { display: true, text: "시간" },
                                                ticks: { maxTicksLimit: 8 },
                                            },
                                            y: {
                                                title: { 
                                                    display: true, 
                                                    text: "가격", 
                                                    font: { size: 14, weight: "bold" }, 
                                                    padding: 10 
                                                },
                                                ticks: {
                                                    callback: (value) => Number(value).toFixed(3),
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-center p-4 text-gray-500">차트 데이터를 불러올 수 없습니다.</p>
                        )}
                    </div>

                    {/* ✅ 4. 기간 선택 버튼 - 그라데이션 스타일 적용 */}
                    <div className="flex justify-center gap-6 mt-8 mb-6 flex-wrap">
                        {periods.map(({ value, label }) => (
                            <button
                                key={value}
                                className={`px-6 py-3 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none ${
                                    selectedPeriod === value 
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold scale-110"  // 선택 시 크기 증가, 글자 두꺼움
                                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base"
                                }`}
                                onClick={() => setSelectedPeriod(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GlobalStock;