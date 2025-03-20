import GlobalStock from "./GlobalStock";
import KoreanStock from "./KoreanStock";

// app/components/StockInfo.tsx
export function KoreanStocks() {
    return (
      <>
        <h2 className="text-xl font-semibold mb-4">Korean Stocks</h2>
        <KoreanStock></KoreanStock>
      </>
    );
  }
  
  export function GlobalStocks() {
    return (
      <>
        <h2 className="text-xl font-semibold mb-4">Global Stocks</h2>
        <GlobalStock></GlobalStock>
      </>
    );
  }
  