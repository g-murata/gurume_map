import { auth } from '../../firebase';
import { useState } from "react"
import { updateReview, deleteReview } from '../../apis/reviews';

import {TagList} from '../TagList';
import {DateTimeConverter} from '../DateTimeConverter'

export const ShowRestrauntModal = (props) => {
  const [selectedReviewItem, setSelectedReviewItem] = useState('')
  const [editReviewModalIsOpen, setEditReviewModalIsOpen] = useState(false);

  const [reviewImage, setReviewImage] = useState(null);
  const [reviewPreview, setReviewPreview] = useState('');

  const onReviewEditDialog = (item) => {
    setSelectedReviewItem(item)
    props.setEvaluation(props.reviews[item].evaluation)
    setReviewPreview(props.reviews[item].image_url || '')
    setEditReviewModalIsOpen(true)
  }
  const closeReviewEditModal = () => {
    props.setError('')
    setReviewImage(null)
    setReviewPreview('')
    setEditReviewModalIsOpen(false);
  }

  const handleReviewImageChange = (e) => {
    const file = e.target.files[0];
    setReviewImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewUpdateSubmit = (event) => {
    event.preventDefault();
    const { content } = event.target.elements;
    updateReview({
      id: props.reviews[selectedReviewItem].id,
      evaluation: props.evaluation,
      content: content.value,
      image: reviewImage
    })
      .then((res) => {
        const updateReviews = props.reviews.map((review) => {
          if (Number(review.id) === Number(props.reviews[selectedReviewItem].id)) {
            review.evaluation = res.reviews.evaluation;
            review.content = res.reviews.content;
            review.updated_at = res.reviews.updated_at;
            review.image_url = res.reviews.image_url;
          }
          return review;
        })
        props.setReview(updateReviews);

        props.setError('')
        closeReviewEditModal();
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          props.setError('不備あり！');
        } else {
          props.setError('通信エラーっす！バックエンド起きてる？');
        }
      });
  }

  const handleReviewDeleteSubmit = (index) => {
    console.log("Attempting to delete review at index:", index);
    const reviewId = props.reviews[index].id;
    console.log("Review ID to delete:", reviewId);
    if (window.confirm("本当にレビューを削除してもよろしいですか？")) {
      deleteReview({
        id: reviewId
      })
        .then(() => {
          console.log("Review deleted successfully");
          const newReviews = [...props.reviews]
          newReviews.splice(index, 1)
          props.setReview(newReviews);
          props.setCheckUsersWithoutReviews(true);
        })
        .catch((error) => {
          console.error("Error deleting review:", error);
          props.setError('通信エラーっす！バックエンド起きてる？');
        });
    }
  }

  return (
    <div className="bg-white p-4 md:p-8 min-h-full">
      {props.error && <p className="mb-4 text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg">{props.error}</p>}
      
      {editReviewModalIsOpen ?
        <form onSubmit={handleReviewUpdateSubmit}>
          <div className="max-w-lg px-4 mx-auto md:px-8">
            <div className="mb-6 text-2xl font-bold text-center text-gray-800">
              レビュー編集
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold text-gray-700">店名</label>
              {props.restaurant.name}
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold text-gray-700">評価</label>
              <props.ReactStarsRating id="evaluation" name="evaluation" className="evaluation" onChange={props.onChange} value={props.evaluation} />
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block mb-2 text-sm font-bold text-gray-700">感想</label>
              <textarea 
                id="content" 
                name="content" 
                rows="4" 
                className="w-full p-4 text-sm text-gray-800 transition-all duration-200 border border-gray-200 h-60 bg-gray-50 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20" 
                placeholder="感想"
                defaultValue={props.reviews[selectedReviewItem].content}
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="edit_review_image">
                写真 <span className="text-xs text-gray-400 font-normal ml-1">(変更する場合のみ選択)</span>
              </label>
              <input 
                type="file" 
                id="edit_review_image" 
                accept="image/*"
                onChange={handleReviewImageChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700" 
              />
              {reviewPreview && (
                <div className="mt-4 w-full h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={reviewPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            
            <div className='flex flex-col gap-3 justify-center mt-8'>
              <button className="w-full px-4 py-3 font-bold text-white transition-colors shadow-sm bg-primary-500 hover:bg-primary-600 rounded-xl">更新する</button>
              <button type="button" className="w-full px-4 py-3 font-bold text-gray-500 transition-colors bg-gray-100 hover:bg-gray-200 rounded-xl" onClick={() => closeReviewEditModal()}>キャンセル</button>
            </div>
          </div>
        </form>
        :
        <>
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左側：レストラン詳細情報 */}
            <div className="md:w-1/2">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-gray-800 md:text-3xl tracking-tight">{props.restaurant.name}</h2>
                <button className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-600 shrink-0 md:hidden" onClick={props.onCloseDialog}>✕</button>
                <button className="hidden md:flex items-center justify-center w-10 h-10 text-gray-400 transition-colors bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-600 shrink-0 absolute top-4 right-4" onClick={props.onCloseDialog}>✕</button>
              </div>

              {(auth.currentUser.email === props.restaurant.user_email) &&
                <div className="flex gap-2 mb-6">
                  <button className="px-4 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors" onClick={() => props.onEditDialog((props.restaurant))}>編集</button>
                  <button className="px-4 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" onClick={() => props.handleDeleteSubmit((props.item))}>削除</button>
                </div>
              }

              <div className="mb-6 overflow-hidden shadow-sm rounded-2xl bg-gray-50 flex justify-center">
                {props.restaurant.image_url == null ?
                  <img src={`${process.env.PUBLIC_URL}/no_image_square.png`} className="object-cover w-1/2 h-48 md:h-64 opacity-50 py-4" alt="Logo" />
                  :
                  <img src={props.restaurant.image_url} alt={props.restaurant.name} className="object-cover w-full h-48 md:h-64" />
                }
              </div>

              <div className="space-y-4">
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className="font-semibold">このお店を登録した人:</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">{props.restaurant.user_name}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <TagList tags_tagged_items={props.tags_tagged_items} tags={props.tags} />
                </div>

                <div className="text-sm text-gray-500 space-y-2 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">投稿日時:</span>
                    <DateTimeConverter created_at={props.restaurant.created_at} />
                  </div>
                  {props.restaurant.url && (
                    <div className='flex items-center gap-2 truncate'>
                      <span className="font-semibold">URL:</span>
                      <a className="text-primary-500 hover:text-primary-600 hover:underline truncate" href={props.restaurant.url} target="_blank" rel="noopener noreferrer">{props.restaurant.url}</a>
                    </div>
                  )}
                </div>

                {props.restaurant.description && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="mb-1 text-sm font-semibold text-gray-500">お店について一言</div>
                    <p className="description text-gray-700 whitespace-pre-wrap leading-relaxed">{props.restaurant.description}</p>
                  </div>
                )}
              </div>

              <div className='flex justify-center mt-8 pb-4'>
                {props.isCheckUserReviewLoading ? (
                  <div className="text-gray-400 animate-pulse font-semibold">読み込み中...</div>
                ) : (
                  <>
                    {auth.currentUser.email === "guest@guest.co.jp" ? (
                      <div className="text-gray-400 text-sm font-semibold italic bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        ゲストユーザーはレビューを投稿できません
                      </div>
                    ) : props.checkUsersWithoutReviews ? (
                      <button 
                        onClick={() => props.OpenReviewModal(props.restaurant.id)}
                        className="w-full md:w-auto px-8 py-3 font-bold text-white transition-all shadow-md bg-yellow-400 hover:bg-yellow-500 rounded-2xl hover:-translate-y-0.5"
                      >
                        ✍️ レビューを投稿する
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-6 py-2.5 bg-green-50 text-green-600 rounded-full text-sm font-bold border border-green-100 shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                          レビュー投稿済みです
                        </div>
                        <div className="flex gap-3">
                          {(() => {
                            const userReviewIndex = props.reviews.findIndex(r => r.email === auth.currentUser.email);
                            if (userReviewIndex !== -1) {
                              return (
                                <>
                                  <button 
                                    className="px-4 py-2 text-sm font-bold text-primary-600 bg-white border border-primary-200 hover:bg-primary-50 rounded-xl transition-colors shadow-sm" 
                                    onClick={() => onReviewEditDialog(userReviewIndex)}
                                  >
                                    ✍️ 編集する
                                  </button>
                                  <button 
                                    className="px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-xl transition-colors shadow-sm" 
                                    onClick={() => handleReviewDeleteSubmit(userReviewIndex)}
                                  >
                                    🗑️ 削除
                                  </button>
                                </>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 右側：レビューリスト */}
            <div className="md:w-1/2">
              <h3 className="mb-4 text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">みんなのレビュー</h3>
              {props.isReviewLoading ? <div className="text-primary-500 animate-pulse font-bold">レビューを読み込み中........</div> :
                <div className="space-y-4">
                  {props.reviews.length > 0 ?
                    <div className='pr-2 overflow-auto max-h-[65vh] scrollbar-hide'>
                      {Object.keys(props.reviews).map(review_item => {
                        return (
                          <div key={review_item} className="p-5 mb-4 transition-all border border-gray-100 shadow-sm bg-gray-50 rounded-2xl hover:shadow-md">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-300 rounded-full">
                                  {props.reviews[review_item].user_name ? props.reviews[review_item].user_name.charAt(0) : "名"}
                                </div>
                                <span className="font-semibold text-gray-700">{props.reviews[review_item].user_name}</span>
                              </div>
                              <span className="star5_rating text-sm" data-rate={props.reviews[review_item].evaluation}></span>
                            </div>
                            
                            {props.reviews[review_item].image_url && (
                              <div className="mb-3 w-full h-40 rounded-xl overflow-hidden border border-gray-100">
                                <img src={props.reviews[review_item].image_url} alt="Review" className="w-full h-full object-cover" />
                              </div>
                            )}

                            <p className="review mb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">{props.reviews[review_item].content}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <DateTimeConverter created_at={props.reviews[review_item].created_at} />
                                {props.reviews[review_item].created_at !== props.reviews[review_item].updated_at && <span>[編集済]</span>}
                              </div>

                              {props.reviews[review_item].email === auth.currentUser.email &&
                                <div className="flex gap-2">
                                  <button 
                                    className="px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors" 
                                    onClick={() => onReviewEditDialog((review_item))}
                                  >
                                    編集
                                  </button>
                                  <button 
                                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" 
                                    onClick={() => handleReviewDeleteSubmit((review_item))}
                                  >
                                    削除
                                  </button>
                                </div>
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    :
                    <div className="p-8 text-center text-red-400 font-bold bg-red-50 rounded-2xl border border-red-100 dashed">
                      まだこのお店のレビューをした人はいないみたいです。
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default ShowRestrauntModal;