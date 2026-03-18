export const CreateReviewModal = (props) => {
  return (
    <div className="bg-white p-6 md:p-8">
      <div className="max-w-lg mx-auto">
        
        {/* ヘッダーと閉じるボタン */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800">
            新規レビュー登録
          </div>
          <button 
            type="button" 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" 
            onClick={() => props.closeReviewModal()}
          >
            ✕
          </button>
        </div>

        {props.error && <p className="mb-4 text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg">{props.error}</p>}

        {/* 店名表示 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            店名
          </label>
          <div className="px-4 py-3 bg-gray-50 text-gray-700 rounded-xl border border-gray-100 font-semibold">
            {props.restaurant.name}
          </div>
        </div>

        {/* 評価 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="evaluation">
            評価
          </label>
          <div className="py-2">
            <props.ReactStarsRating 
              id="evaluation" 
              name="evaluation" 
              className="evaluation flex gap-1" 
              onChange={props.onChange} 
              value={props.evaluation} 
            />
          </div>
        </div>

        {/* 感想入力エリア */}
        <div className="mb-8">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            感想
          </label>
          <textarea 
            id="content" 
            name="content" 
            rows="6" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            placeholder="このお店の良かったところ、おすすめメニューなど..."
          ></textarea>
        </div>

        {/* ボタンエリア */}
        <div className='flex flex-col gap-3'>
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors duration-200">
            レビューを投稿する
          </button>
          <button 
            type="button" 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-xl transition-colors duration-200" 
            onClick={() => props.closeReviewModal()}
          >
            キャンセル
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreateReviewModal;