import Game from "./Game";

export default function EndScreen({ grid, status, answer }: { grid: [string, string][][], status: string, answer: string }) {
  return (<>
    <Game initialGrid={grid} />
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-15 px-2">
      <div className="text-center bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
        <p className="text-4xl font-semibold" style={{ color: status == "w" ? "#32a852" : "#b82e2e" }}>{status == "w" ? `You won!` : "You lost!"}</p>
        <p className="text-3xl font-medium text-gray-400 mt-2">The word was <span className="font-bold">{answer}</span></p>
        <button className="mt-4 text-white px-3 py-2 rounded-xl bg-blue-600 font-semibold text-xl border-2 border-blue-700 transition hover:bg-blue-700" onClick={() => location.reload()}>Play Again</button>
      </div>
    </div>
  </>);
}