"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchForexData, fetchForexSummary } from "@/lib/apis/forex";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import "chartjs-adapter-date-fns"; 
import { format } from "date-fns"; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

// ✅ Forex 데이터 타입 정의
interface ForexChartData {
    labels: string[];
    datasets: { label: string; data: number[] }[];
}

interface ForexSummary {
    currencyCode: string;
    currencyName: string;
    exchangeRate: number | null;
    changeRate: number | null;
    timestamp: string;
}

// API 에러 타입 정의
interface ApiError {
    message?: string;
    response?: {
        status: number;
    };
}

// ✅ 환율 종류 배열
const currencyPairs = [
    { code: "EUR/USD", label: "유로/달러" },
    { code: "USD/KRW", label: "달러/원" },
    { code: "JPY/KRW", label: "엔/원" },
];

// ✅ 기간 종류 배열
const periods = [
    { value: "today", label: "실시간" },
    { value: "yesterday", label: "어제" },
    { value: "oneweek", label: "1주일" },
    { value: "onemonth", label: "1달" },
    { value: "threemonth", label: "3달" },
];

const CurrencyRate = () => {
    const [selectedCurrency, setSelectedCurrency] = useState(currencyPairs[0].code);
    const [selectedPeriod, setSelectedPeriod] = useState("today");
    const [forexData, setForexData] = useState<Record<string, ForexChartData>>({});
    const [summaryData, setSummaryData] = useState<Record<string, ForexSummary>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [periodErrors, setPeriodErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 요약 데이터 가져오기 (이건 항상 시도하지만 표시하지 않음)
                try {
                    const summary = await fetchForexSummary(selectedCurrency);
                    setSummaryData(prev => ({ ...prev, [selectedCurrency]: summary }));
                } catch (summaryErr) {
                    console.error("요약 데이터 로딩 오류:", summaryErr);
                }

                // 차트 데이터 가져오기
                try {
                    const chartData = await fetchForexData(selectedCurrency, selectedPeriod);
                    setForexData(prev => ({ ...prev, [selectedCurrency]: chartData }));
                    
                    // 성공했으면 해당 기간의 에러 상태 제거
                    setPeriodErrors(prev => ({ 
                        ...prev, 
                        [`${selectedCurrency}_${selectedPeriod}`]: false 
                    }));
                } catch (chartErr: unknown) {
                    console.error("차트 데이터 로딩 오류:", chartErr);
                    
                    // 타입 가드를 사용하여 chartErr 타입 확인
                    const apiError = chartErr as ApiError;
                    
                    // 404 에러인 경우 특별 처리
                    if (apiError.response && apiError.response.status === 404) {
                        console.log("해당 기간에 데이터가 없습니다:", selectedPeriod);
                        setPeriodErrors(prev => ({ 
                            ...prev, 
                            [`${selectedCurrency}_${selectedPeriod}`]: true 
                        }));
                    } else {
                        // 다른 종류의 에러는 일반 에러로 처리
                        const errorMessage = apiError.message || "알 수 없는 오류";
                        setError(`차트 데이터를 불러오는 데 실패했습니다: ${errorMessage}`);
                    }
                }
            } catch (err: unknown) {
                console.error("환율 데이터 로딩 오류:", err);
                const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
                setError(`환율 데이터를 불러오는 데 실패했습니다: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCurrency, selectedPeriod]);

    // 차트 데이터 및 옵션 준비
    const prepareChartData = () => {
        if (!forexData[selectedCurrency]) return null;

        try {
            // 타임스탬프를 Date 객체로 변환하여 사용
            const labels = forexData[selectedCurrency].labels.map(timestamp => {
                try {
                    const date = new Date(timestamp);
                    return format(date, "HH:mm");
                } catch (e) {
                    console.error("Date formatting error:", e);
                    return timestamp; // 변환 실패 시 원본 값 반환
                }
            });

            return {
                labels,
                datasets: [
                    {
                        label: selectedCurrency,
                        data: forexData[selectedCurrency].datasets[0].data,
                        borderColor: "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                    },
                ],
            };
        } catch (error) {
            console.error("차트 데이터 준비 중 오류:", error);
            return null;
        }
    };

    const chartData = prepareChartData();
    const hasPeriodError = periodErrors[`${selectedCurrency}_${selectedPeriod}`];
    const currentSummary = summaryData[selectedCurrency];

    if (loading) return <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;

    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            {/* ✅ 상단 환율 선택 버튼 */}
            <div className="flex justify-center gap-4 mb-6">
                {currencyPairs.map(({ code }) => (
                    <button
                        key={code}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            selectedCurrency === code ? "bg-blue-500 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        onClick={() => setSelectedCurrency(code)}
                    >
                        {code}
                    </button>
                ))}
            </div>
            
            {/* ✅ 요약 정보 표시 */}
            {currentSummary && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">현재 환율</p>
                            <p className="text-2xl font-bold">
                                {currentSummary.exchangeRate !== null 
                                    ? currentSummary.exchangeRate.toFixed(3) 
                                    : "-"}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">변동률</p>
                            <p className={`text-xl font-bold ${
                                currentSummary.changeRate === null ? "text-gray-500" :
                                currentSummary.changeRate > 0 ? "text-red-500" : 
                                currentSummary.changeRate < 0 ? "text-blue-500" : "text-gray-700"
                            }`}>
                                {currentSummary.changeRate !== null
                                    ? `${currentSummary.changeRate > 0 ? "+" : ""}${currentSummary.changeRate.toFixed(2)}%`
                                    : "-"}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">갱신 시간</p>
                            <p className="text-sm">
                                {currentSummary.timestamp
                                    ? format(new Date(currentSummary.timestamp), "yyyy-MM-dd HH:mm")
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ 차트 */}
            <div className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-bold mb-2">{selectedCurrency} 환율 변동</h3>
                
                {hasPeriodError ? (
                    <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-md">
                        <div className="text-amber-500 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-medium text-center">해당 기간에 대한 데이터가 없습니다.</p>
                        <p className="text-gray-500 text-sm mt-2 text-center">다른 기간을 선택해 주세요.</p>
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
                                            label: (context) => `환율: ${context.raw}`,
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
                                            text: "환율", 
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
                    <div className="flex justify-center items-center h-64 bg-gray-50">
                        <p className="text-gray-500">차트 데이터를 불러올 수 없습니다.</p>
                    </div>
                )}
            </div>

            {/* ✅ 기간 선택 버튼 */}
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {periods.map(({ value, label }) => (
                    <button
                        key={value}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            selectedPeriod === value 
                                ? "bg-blue-500 text-white font-bold" 
                                : periodErrors[`${selectedCurrency}_${value}`]
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-200 hover:bg-gray-300"
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

export default CurrencyRate;