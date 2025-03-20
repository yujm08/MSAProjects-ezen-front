// app/page.tsx
import Navbar from '../components/Navbar';
import CurrencyRate from '../components/CurrencyRate';
import { KoreanStocks, GlobalStocks } from '../components/StockInfo';
import Board from '../components/Board';

export default function HomePage() {
  return (
    <div>
      <section className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Main Page</h2>
        <p className="text-gray-700 mb-8">This is the main page with financial data available for viewing without logging in.</p>

        {/* ✅ Currency Section */}
        <div id="currency" className="bg-gray-100 rounded-lg p-6 mb-6 shadow-sm">
          <CurrencyRate />
        </div>

        {/* ✅ Korean Stocks Section */}
        <div id="korean-stocks" className="bg-gray-100 rounded-lg p-6 mb-6 shadow-sm">
          <KoreanStocks />
        </div>

        {/* ✅ Global Stocks Section */}
        <div id="global-stocks" className="bg-gray-100 rounded-lg p-6 mb-6 shadow-sm">
          <GlobalStocks />
        </div>

        {/* ✅ Board Section */}
        <div id="board" className="bg-gray-100 rounded-lg p-6 mb-6 shadow-sm">
          <Board />
        </div>
      </section>

      <Navbar />
    </div>
  );
}
