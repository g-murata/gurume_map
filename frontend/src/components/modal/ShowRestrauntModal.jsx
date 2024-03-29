import { auth } from '../../firebase';
import { useState } from "react"
import { updateReview, deleteReview } from '../../apis/reviews';

import {TagList} from '../TagList';
import {DateTimeConverter} from '../DateTimeConverter'

export const ShowRestrauntModal = (props) => {
  const [selectedReviewItem, setSelectedReviewItem] = useState('')
  const [editReviewModalIsOpen, setEditReviewModalIsOpen] = useState(false);

  // const onReviewShowDialog = (value) => {
  //   setSelectedReviewItem(value.id)
  // }
  const onReviewEditDialog = (item) => {
    setSelectedReviewItem(item)
    props.setEvaluation(props.reviews[item].evaluation)
    setEditReviewModalIsOpen(true)
  }
  const closeReviewEditModal = () => {
    props.setError('')
    setEditReviewModalIsOpen(false);
  }

  const handleReviewUpdateSubmit = (event) => {

    event.preventDefault();
    const { content } = event.target.elements;
    updateReview({
      id: props.reviews[selectedReviewItem].id,
      evaluation: props.evaluation,
      content: content.value,
    })
      .then((res) => {
        // UPDATEの参考
        // https://zenn.dev/sprout2000/books/76a279bb90c3f3/viewer/chapter10
        const updateReviews = props.reviews.map((review) => {
          if (Number(review.id) === Number(props.reviews[selectedReviewItem].id)) {
            review.evaluation = res.reviews.evaluation;
            review.content = res.reviews.content;
            review.updated_at = res.reviews.updated_at;
          }
          return review;
        })
        // TODO:これいらなそうか。
        props.setReview(updateReviews);

        props.setError('')
        setEditReviewModalIsOpen(false);
        // setIsLoading(false);
      })
      .catch((error) => {
        switch (error.code) {
          case 'ERR_BAD_RESPONSE':
            props.setError('不備あり！');
            break;
          default:
            props.setError('エラーっす！Herokuのデプロイ先どうしようか？');
            break;
        }
        // setIsLoading(false);
      });
  }


  const handleReviewDeleteSubmit = (index) => {
    if (window.confirm("本当にレビューを削除してもよろしいですか？")) {
      deleteReview({
        id: props.reviews[index].id
      })
        .then(() => {
          const newReviews = [...props.reviews]
          newReviews.splice(index, 1)
          props.setReview(newReviews);
          props.setCheckUsersWithoutReviews(true);
        })
        .catch((error) => {
          switch (error.code) {
            case 'ERR_BAD_RESPONSE':
              props.setError('不備あり！');
              break;
            default:
              props.setError('エラーっす！Herokuのデプロイ先どうしようか？');
              break;
          }
        });
    }
  }


  return (
    <>
      {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
      {editReviewModalIsOpen ?
        <form onSubmit={handleReviewUpdateSubmit}>
          <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
            <div className="text-3xl font-bold text-center">
              レビュー編集
            </div>
            {/* TODO:モーダルを閉じたい。 */}
            <div className="text-right">
              <button className="font-bold" onClick={() => closeReviewEditModal()}>Close</button>
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
              店名
            </label>
            <p className="restaurant_name">{props.restaurant.name}</p>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" for="evaluation">
                評価
              </label>
              <props.ReactStarsRating id="evaluation" name="evaluation" placeholder="評価" className="evaluation" onChange={props.onChange} value={props.evaluation} />
            </div>
            <div>
              <label for="content" className="block text-gray-700 text-sm font-bold mb-2">
                感想
              </label>
              <textarea id="content" name="content" rows="4" className="h-60 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="感想"
                defaultValue={props.reviews[selectedReviewItem].content}></textarea>
            </div>
            <div className='flex justify-center '>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">更新</button>
            </div>
            <div className="text-right">
              <button className="font-bold" onClick={() => closeReviewEditModal()}>詳細画面に戻る</button>
            </div>
          </div>
        </form>
        :
        <>
          <div className="md:flex md:h-full">
            <div className="md:px-8 md:w-9/12">
              <div className="flex place-content-between w-11/12  md:m-auto">
                <div className="text-3xl font-bold mb-2">{props.restaurant.name}</div>
                <button className="fixed top-1 right-1 md:right-0 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mx-2 rounded" onClick={props.onCloseDialog}>×</button>
              </div>
              <div className="md:px-8 md:w-9/12">
                {(auth.currentUser.email === props.restaurant.user_email) &&
                  <>
                    <button className="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => props.onEditDialog((props.restaurant))}>編集</button>
                    <button className="text-xs bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-8 rounded" onClick={() => props.handleDeleteSubmit((props.item))}>削除</button>
                  </>
                }
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
                <div className='my-3'>         
                  <span>このお店を登録した人：</span>
                  <p className="user_name">{props.restaurant.user_name}</p>
                </div>
                <TagList 
                  tags_tagged_items={props.tags_tagged_items}
                  tags={props.tags}
                />
                <div className="text-gray-500 mt-3">
                  <h1>投稿日時：</h1>   
                  <div className="flex">                             
                    <DateTimeConverter 
                      created_at={props.restaurant.created_at}
                    />
                    {/* {props.restaurant.created_at !== props.restaurant.updated_at && <label>[編集済]</label>} */}
                  </div>
                  <div className='mt-3'>         
                    <span>URL：</span>
                    <a className="cursor-pointer text-blue-500 underline" href={props.restaurant.url} target="_blank" rel="noopener noreferrer">{props.restaurant.url}</a>
                  </div>    
                </div>   
                <div className="text-gray-500 mt-3">お店について一言：</div>  
                <p className="description text-gray-500">{props.restaurant.description}</p>
                <div className='flex justify-center'>
                  {props.isCheckUserReviewLoading ? <h1>・・・</h1> :
                    <>
                      {(props.checkUsersWithoutReviews && auth.currentUser.email !== "guest@guest.co.jp") &&
                        <button button onClick={() => props.OpenReviewModal(props.restaurant.id)}
                          className="cursor-pointer bg-yellow-500 hover:bg-yellow-300 text-white font-bold py-2 px-4 my-6 rounded-full">レビューを投稿する
                        </button>
                      }
                    </>
                  }
                </div>
              </p>
            </div>
            <>
              {props.isReviewLoading ? <h1 className="text-blue-600">レビューを読み込み中........</h1> :
                <>
                  <div className="md:px-8 md:w-full">
                    {props.reviews.length > 0 ?
                      <div className='h-full overflow-auto'>
                        {Object.keys(props.reviews).map(review_item => {
                          return (
                            <>
                              <div className="bg-slate-100 rounded-xl p-8 mb-5">
                                <span>レビューした人：</span>
                                <p className="user_name">{props.reviews[review_item].user_name}</p>
                                <span>評価：</span>
                                <span className="star5_rating" data-rate={props.reviews[review_item].evaluation}></span>
                                <p>感想：</p>
                                <p className="review">{props.reviews[review_item].content}</p>
                                <br />
                                <div className="text-gray-500">
                                  <h1>投稿日時：</h1>         
                                  <div className="flex">                       
                                    <DateTimeConverter 
                                      created_at={props.reviews[review_item].created_at}
                                    />
                                    {props.reviews[review_item].created_at !== props.reviews[review_item].updated_at && <label>[編集済]</label>}
                                  </div>       
                                </div>

                                {/* TODO: */}
                                <div className="flex justify-end">
                                  {/* <button className="font-bold mx-8" onClick={() => onReviewShowDialog((props.reviews[review_item]))}>詳細</button> */}
                                  {props.reviews[review_item].email === auth.currentUser.email &&
                                    <>
                                      <button className="text-blue-600 font-bold mx-8" onClick={() => onReviewEditDialog((review_item))}>編集</button>
                                      <button className="text-red-600 font-bold mx-8" onClick={() => handleReviewDeleteSubmit((review_item))}>削除</button>
                                    </>
                                  }
                                </div>
                              </div>
                            </>
                          )
                        })}
                      </div>
                      :
                      <div style={{ color: 'red' }}>まだこのお店のレビューをした人はいないみたいです。</div>
                    }
                  </div>
                </>
              }
            </>
          </div> 
        </>
      }
    </>
  )
}

export default ShowRestrauntModal;
