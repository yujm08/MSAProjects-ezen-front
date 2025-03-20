"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { fetchKoreanStockData, fetchKoreanStockSummary } from "@/lib/apis/koreanStock";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

// Define proper types for stock data
interface StockChartData {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}

interface StockSummary {
  currentPrice: number | null;
  changeRate: number | null;
  timestamp?: string;
}

// ✅ 국내 주식 목록 (KOSPI, KOSDAQ 포함)
const stockList = [
    { code: "005930", label: "삼성전자" },
    { code: "373220", label: "LG에너지솔루션" },
    { code: "000660", label: "SK하이닉스" },
    { code: "207940", label: "삼성바이오로직스" },
    { code: "035420", label: "NAVER" },
    { code: "051910", label: "LG화학" },
    { code: "006400", label: "삼성SDI" },
    { code: "005380", label: "현대차" },
    { code: "035720", label: "카카오" },
    { code: "068270", label: "셀트리온" },
    { code: "000270", label: "기아" },
    { code: "028260", label: "삼성물산" },
    { code: "105560", label: "KB금융" },
    { code: "323410", label: "카카오뱅크" },
    { code: "011200", label: "HMM" },
    { code: "035900", label: "JYP Ent." },
    { code: "066570", label: "LG전자" },
    { code: "096770", label: "SK이노베이션" },
    { code: "078930", label: "GS" },
    { code: "000810", label: "삼성화재" },
];

// ✅ 기간 선택 옵션
const periods = [
    { value: "today", label: "실시간" },
    { value: "yesterday", label: "어제" },
    { value: "oneweek", label: "1주일" },
    { value: "onemonth", label: "1달" },
    { value: "threemonth", label: "3달" },
];

const KoreanStock = () => {
    const [selectedStock, setSelectedStock] = useState(stockList[0].code);
    const [selectedPeriod, setSelectedPeriod] = useState("today");
    const [stockData, setStockData] = useState<Record<string, StockChartData | null>>({});
    const [summaryData, setSummaryData] = useState<Record<string, StockSummary | null>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    // 선택된 주식의 라벨(이름) 가져오기
    const getSelectedStockLabel = () => {
        const stock = stockList.find(item => item.code === selectedStock);
        return stock ? stock.label : selectedStock;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);
                setNotFound(false);

                // ✅ 요약 정보 가져오기
                try {
                    const summary = await fetchKoreanStockSummary(selectedStock);
                    setSummaryData(prev => ({ ...prev, [selectedStock]: summary }));
                } catch (err) {
                    console.log(err);
                    console.warn(`요약 데이터 없음: ${selectedStock}`);
                }

                // ✅ 차트 데이터 가져오기
                try {
                    const chartData = await fetchKoreanStockData(selectedStock, selectedPeriod);
                    setStockData(prev => ({ ...prev, [selectedStock]: chartData }));
                } catch (chartErr: unknown) {
                    if (chartErr instanceof Error && chartErr.message.includes("404")) {
                        setNotFound(true);
                    } else {
                        setErrorMessage("주식 데이터를 불러오는 데 실패했습니다.");
                    }
                }
            } catch (err) {
                console.log(err);
                setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedStock, selectedPeriod]);

    // ✅ 차트 데이터 변환
    const chartData = stockData[selectedStock]
        ? {
              labels: stockData[selectedStock]?.labels.map((timestamp: string) => format(new Date(timestamp), "HH:mm")),
              datasets: [
                  {
                      label: getSelectedStockLabel(),
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

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            {/* ✅ 주식 선택 버튼 - 사진과 비슷하게 표시 */}
            <div className="flex flex-wrap gap-2 mb-6">
                {stockList.map(({ code, label }) => (
                    <button
                        key={code}
                        className={`px-4 py-2 rounded-md text-center ${
                            selectedStock === code ? "bg-teal-500 text-white" : "bg-teal-500 bg-opacity-80 text-white"
                        }`}
                        onClick={() => setSelectedStock(code)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Loading and error states */}
            {isLoading && <p className="text-center">로딩 중...</p>}
            {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}

            {/* ✅ 2. 요약 정보 - 가로로 정렬 */}
            {summaryData[selectedStock] && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-2">
                            <p className="text-gray-600 text-sm">현재 금액</p>
                            <p className="text-2xl font-bold">{summaryData[selectedStock]?.currentPrice ?? "-"}</p>
                        </div>
                        <div className="p-2">
                            <p className="text-gray-600 text-sm">변동률</p>
                            <p className={`text-2xl font-bold ${(summaryData[selectedStock]?.changeRate || 0) > 0 ? "text-red-500" : "text-blue-500"}`}>
                                {summaryData[selectedStock]?.changeRate ? `${summaryData[selectedStock].changeRate.toFixed(2)}%` : "-"}
                            </p>
                        </div>
                        <div className="p-2">
                            <p className="text-gray-600 text-sm">갱신 시간</p>
                            <p className="text-lg">
                                {summaryData[selectedStock]?.timestamp
                                    ? format(new Date(summaryData[selectedStock].timestamp), "yyyy-MM-dd HH:mm")
                                    : format(new Date(), "yyyy-MM-dd HH:mm")}
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {/* ✅ 차트 표시 - 이름으로 타이틀 표시 */}
            <div className="bg-white p-4 rounded-md">
                <h3 className="text-lg font-bold mb-2">{getSelectedStockLabel()} 가격 변동</h3>
                {notFound ? (
                    <div className="text-center p-6 text-gray-500">
                        📉 해당 기간의 데이터가 없습니다. 다른 기간을 선택해주세요.
                    </div>
                ) : chartData ? (
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
                                            padding: 10,
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
                    <p>차트 데이터를 불러올 수 없습니다.</p>
                )}
            </div>

            {/* ✅ 하단 기간 선택 버튼 - 그라데이션 적용 및 선택 효과 */}
            <div className="flex justify-between mt-4 gap-2">
                {periods.map(({ value, label }) => (
                    <button
                        key={value}
                        className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600 focus:outline-none ${
                            selectedPeriod === value 
                            ? "font-bold text-white scale-105" 
                            : ""
                        }`}
                        onClick={() => setSelectedPeriod(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default KoreanStock;