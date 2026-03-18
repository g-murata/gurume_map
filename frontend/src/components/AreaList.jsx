export const AreaList = ({ areas, selectedArea, setSelectedArea }) => {
  return (
    <div className="relative inline-block">
      <select
        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-bold cursor-pointer transition-all hover:bg-gray-50"
        value={selectedArea}
        onChange={(e) => setSelectedArea(Number(e.target.value))}
      >
        {Object.keys(areas).map(key => (
          <option key={key} value={Number(key)}>
            📍 {areas[Number(key)].name}
          </option>
        ))}
      </select>
      {/* 右側の矢印アイコン */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  )
}