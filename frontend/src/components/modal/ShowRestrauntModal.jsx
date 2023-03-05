export const ShowRestrauntModal = (props) => {
  return (
    <>
      <div className="flex place-content-between w-11/12  m-auto">
        <div className="text-3xl font-bold mb-2">{props.restaurant.name}</div>
        <button className="font-bold" onClick={() => props.onEditDialog((props.restaurant))}>編集</button>
        <button className="font-bold" onClick={() => props.handleDeleteSubmit((props.restaurant.id))}>削除</button>
        <button className="font-bold" onClick={props.onCloseDialog}>Close</button>
      </div>

      <p className="text-gray-700 text-base w-11/12 m-auto">
        {/* TODO:平均評価を計算する */}
        {/* <span>平均評価：</span>
                            <span className="star5_rating" data-rate={restaurants[item].evaluation}></span> */}
        {props.restaurant.image == null ?
          <div className="flex justify-center ">
            <img src={`${process.env.PUBLIC_URL}/no_image_square.png`} className="w-2/4" alt="Logo" />
          </div>
          :
          <img
            className="w-7/12 m-auto"
            src={props.restaurant.image}
            alt="ほげほげ画像"
          ></img>
        }
        <span>このお店を登録した人：</span>
        <p className="user_name">{props.restaurant.user_name}</p>
        <div className='flex justify-center'>
          <button className="bg-yellow-500 hover:bg-yellow-300 text-white font-bold py-2 px-4 my-6 rounded-full">レビューを投稿する</button>
        </div>
        <>
          {/* {isLoading ? <h1 className="text-blue-600">レビューを読み込み中........</h1> :
            <>
              {reviews.length > 0 ?
                <div className='overflow-auto h-56'>
                  {Object.keys(reviews).map(item => {
                    return (
                      <>
                        {console.log("TODO:再レンダリングしすぎ")}
                        {console.log(item)}
                        <div class="bg-slate-100 rounded-xl p-8 dark:bg-slate-800 mb-5">
                          <span>レビューした人：</span>
                          <p className="user_name">{reviews[item].user_name}</p>
                          <span>評価：</span>
                          <span className="star5_rating" data-rate={reviews[item].evaluation}></span>
                          <p>感想：</p>
                          <p className="review">{reviews[item].content}</p>
                          <div>
                            <button className="font-bold " onClick={() => onEditDialog((props.restaurant))}>編集(未完成)</button>
                            <button className="font-bold mx-8" onClick={() => handleDeleteSubmit((props.restaurant.id))}>削除(未完成)</button>
                          </div>
                        </div>
                      </>
                    )
                  })}
                </div>
                :
                <div style={{ color: 'red' }}>まだこのお店のレビューをした人はいないみたいです。</div>
              }
            </>
          } */}
        </>
      </p>
    </>
  )
}

export default ShowRestrauntModal;
