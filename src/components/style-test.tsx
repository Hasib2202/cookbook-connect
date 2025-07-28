export default function StyleTest() {
  return (
    <div className="p-4 text-white bg-red-500">
      <h1 className="text-2xl font-bold">Style Test</h1>
      <p className="text-sm">If you can see red background and white text, Tailwind is working!</p>
      <div className="mt-4 space-y-2">
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          Test Button
        </button>
        <div className="p-2 bg-green-500 rounded">
          Green Box
        </div>
      </div>
    </div>
  )
}
