import Link from "next/link";

// app/components/Board.tsx
export default function Board() {
    return (
      <section id="board" className="bg-gray-100 p-6 rounded shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Forum</h2>
        <p className="text-gray-700">Join the conversation in the forum!</p>
        <Link href="/board" className="text-blue-600 hover:underline">Go to the Board</Link>
      </section>
    );
  }
  