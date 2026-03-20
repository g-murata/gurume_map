import { useState, useEffect } from "react";

export const CreateReviewModal = (props) => {
  const [preview, setPreview] = useState('');

  const checkDirty = () => {
    const content = document.getElementById('content')?.value || '';
    const hasContent = content !== '';
    const hasImage = props.reviewImage !== null;
    const hasEvaluation = props.evaluation !== 3; // 初期値3以外なら変更ありとみなす

    props.setIsDirty(hasContent || hasImage || hasEvaluation);
  };

  useEffect(() => {
    checkDirty();
  }, [props.evaluation]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    props.setReviewImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        props.setIsDirty(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('');
      setTimeout(checkDirty, 0);
    }
  };

  return (
    <form onSubmit={props.handleReviewSubmit} onChange={checkDirty} className="bg-white p-6 md:p-8">
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
            {props.restaurant.name}
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

        {/* 写真追加 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="review_image">
            料理やお店の写真 <span className="text-xs text-gray-400 font-normal ml-1">(任意)</span>
          </label>
          <input 
            type="file" 
            id="review_image" 
            name="image" 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" 
          />
          {preview && (
            <div className="mt-4 relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" />
              <img src={preview} alt="Preview" className="relative z-10 max-w-full max-h-full object-contain" />
              <button 
                type="button" 
                onClick={() => {props.setReviewImage(null); setPreview(''); document.getElementById('review_image').value = '';}}
                className="absolute top-2 right-2 z-20 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >✕</button>
            </div>
          )}
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
    </form>
  )
}

export default CreateReviewModal;