export default function TailwindTest() {
  return (
    <div className="max-w-6xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Tailwind Grid Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-gray-100 p-4 rounded">
        <div className="md:col-span-4 bg-blue-500 text-white p-4 rounded">
          MD:COL-SPAN-4
        </div>
        <div className="md:col-span-2 bg-green-500 text-white p-4 rounded">
          MD:COL-SPAN-2
        </div>
        <div className="md:col-span-3 bg-red-500 text-white p-4 rounded">
          MD:COL-SPAN-3
        </div>
        <div className="md:col-span-3 bg-yellow-500 text-black p-4 rounded">
          MD:COL-SPAN-3
        </div>
      </div>
      <div className="mt-4 text-sm">
        <p>Current viewport width: Check if grid displays correctly above 768px</p>
      </div>
    </div>
  );
}