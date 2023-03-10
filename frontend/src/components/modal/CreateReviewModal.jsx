export const CreateReViewModal = (props) => {
  return (
    <>
      <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
        <div className="text-3xl font-bold text-center">
          新規レビュー登録
        </div>
        {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
        <div className="text-right">
          <button className="font-bold" onClick={() => props.closeReviewModal()}>Close</button>
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
          店名
        </label>
        <p className="user_name">{"props.restaurant.user_name"}</p>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" for="evaluation">
            評価
          </label>
          <props.ReactStarsRating id="evaluation" name="evaluation" placeholder="評価" className="evaluation" onChange={props.onChange} value={props.evaluation} />
        </div>
        <div>
          <label for="review" className="block text-gray-700 text-sm font-bold mb-2">
            感想
          </label>
          <textarea id="review" name="review" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="感想"></textarea>
        </div>
        <div className='flex justify-center '>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">登録</button>
        </div>
        {/* <div className="text-right">
          <button className="font-bold" onClick={() => props.closeReviewModal()}>詳細画面に戻る</button>
        </div> */}
      </div>
    </>
  )
}

export default CreateReViewModal;
