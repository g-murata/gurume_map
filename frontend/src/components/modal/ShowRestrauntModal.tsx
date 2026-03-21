import React, { useState } from "react"
import { auth } from '../../firebase';
import { deleteReview } from '../../apis/reviews';
import { TagList } from '../TagList';
import { DateTimeConverter } from '../DateTimeConverter'
import ReviewModal from './ReviewModal';
import { UserProfileModal } from './UserProfileModal';
import { User, Restraunt, Review, Tag, TagsTaggedItem } from '../../types/index';

interface ShowRestrauntModalProps {
  restaurant: Restraunt & { user_email?: string; user_name?: string; user_image_url?: string; image_url?: string; created_at: string };
  reviews: Review[] & any[]; // reviews is an array but accessed by index in some places
  setReview: (reviews: Review[]) => void;
  tags: Tag[];
  tags_tagged_items: { [key: string]: TagsTaggedItem };
  onCloseDialog: () => void;
  onEditDialog: (restaurant: any) => void;
  handleDeleteSubmit: (item: any) => void;
  item: any;
  error: string | null;
  setError: (error: string) => void;
  setIsLoading?: (loading: boolean) => void;
  isReviewLoading?: boolean;
  isCheckUserReviewLoading?: boolean;
  checkUsersWithoutReviews: boolean;
  setCheckUsersWithoutReviews: (val: boolean) => void;
  OpenReviewModal: (id: number) => void;
  openImageLightbox: (url: string) => void;
  setIsDirty: (dirty: boolean) => void;
  evaluation: number;
  setEvaluation: (val: number) => void;
  onChange: (e: any) => void;
  ReactStarsRating: any;
  currentUserInfo: User | false | null;
}

export const ShowRestrauntModal: React.FC<ShowRestrauntModalProps> = (props) => {
  const [selectedReviewItem, setSelectedReviewItem] = useState<number | null>(null)
  const [editReviewModalIsOpen, setEditReviewModalIsOpen] = useState(false);
  
  const [profileModalUser, setProfileModalUser] = useState<User | null>(null);
  const [profileModalIsOpen, setProfileModalIsOpen] = useState(false);

  const openUserProfile = (userData: any) => {
    const name = userData.name || userData.user_name;
    const email = userData.email;
    if (!email || !name) return;

    // もし開こうとしているのが「自分」なら、最新の currentUserInfo を使う
    if (props.currentUserInfo && (props.currentUserInfo as User).email === email) {
      setProfileModalUser(props.currentUserInfo as User);
    } else {
      setProfileModalUser({
        id: userData.user_id || userData.id || 0,
        name: name,
        email: email,
        image_url: userData.user_image_url || null, // レビュー画像(image_url)とは明確に区別
        reviews_count: userData.reviews_count || 0,
        restraunts_count: userData.restraunts_count || 0
      } as User);
    }
    setProfileModalIsOpen(true);
  };

  const onReviewEditDialog = (index: number) => {
    setSelectedReviewItem(index)
    props.setEvaluation(props.reviews[index].evaluation)
    setEditReviewModalIsOpen(true)
  }
  const closeReviewEditModal = () => {
    setEditReviewModalIsOpen(false);
    props.setIsDirty(false);
  }

  const handleReviewDeleteSubmit = (index: number) => {
    const reviewId = props.reviews[index].id;
    if (window.confirm("本当にレビューを削除してもよろしいですか？")) {
      if (props.setIsLoading) props.setIsLoading(true);
      deleteReview({
        id: reviewId
      })
        .then(() => {
          const newReviews = [...props.reviews]
          newReviews.splice(index, 1)
          props.setReview(newReviews);
          props.setCheckUsersWithoutReviews(true);
          if (props.setIsLoading) props.setIsLoading(false);
        })
        .catch((error) => {
          props.setError('通信エラーっす！バックエンド起きてる？');
          if (props.setIsLoading) props.setIsLoading(false);
        });
    }
  }

  return (
    <div className="bg-white p-4 md:p-8 min-h-full">
      {props.error && <p className="mb-4 text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg">{props.error}</p>}
      
      {editReviewModalIsOpen && selectedReviewItem !== null ?
        <ReviewModal 
          mode="edit"
          restaurant={props.restaurant}
          review={props.reviews[selectedReviewItem]}
          setIsDirty={props.setIsDirty}
          openImageLightbox={props.openImageLightbox}
          closeReviewModal={closeReviewEditModal}
          error={props.error || undefined}
          setError={props.setError}
          setIsLoading={props.setIsLoading}
          reviews={props.reviews}
          setReview={props.setReview}
          ReactStarsRating={props.ReactStarsRating}
          // @ts-ignore
          user={auth.currentUser}
        />
        :
        <>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-gray-800 md:text-3xl tracking-tight">{props.restaurant.name}</h2>
                <button className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-600 shrink-0 md:hidden" onClick={props.onCloseDialog}>✕</button>
                <button className="hidden md:flex items-center justify-center w-10 h-10 text-gray-400 transition-colors bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-600 shrink-0 absolute top-4 right-4" onClick={props.onCloseDialog}>✕</button>
              </div>

              {(auth.currentUser?.email === props.restaurant.user_email) &&
                <div className="flex gap-2 mb-6">
                  <button className="px-4 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors" onClick={() => props.onEditDialog((props.restaurant))}>編集</button>
                  <button className="px-4 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" onClick={() => props.handleDeleteSubmit((props.item))}>削除</button>
                </div>
              }

              <div className="mb-6 overflow-hidden shadow-sm rounded-2xl bg-gray-100 relative h-48 md:h-64 flex justify-center items-center">
                {props.restaurant.image_url == null ?
                  <img src={`${process.env.PUBLIC_URL}/no_image_square.png`} className="object-contain w-1/2 h-full opacity-50 py-4" alt="Logo" />
                  :
                  <div 
                    className="w-full h-full cursor-pointer group relative flex items-center justify-center"
                    onClick={() => props.openImageLightbox(props.restaurant.image_url!)}
                  >
                    <img src={props.restaurant.image_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 group-hover:opacity-50 transition-opacity" />
                    <img src={props.restaurant.image_url} alt={props.restaurant.name} className="relative z-10 object-contain w-full h-full" />
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <span className="text-white text-sm font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">画像を拡大</span>
                    </div>
                  </div>
                }
              </div>

              <div className="space-y-4">
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className="font-semibold">このお店を登録した人:</span>
                  <button 
                    onClick={() => openUserProfile({ 
                      id: props.restaurant.user_id, 
                      name: props.restaurant.user_name, 
                      email: props.restaurant.user_email,
                      image_url: props.restaurant.user_image_url 
                    } as any)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  >
                    {props.restaurant.user_image_url ? (
                      <img src={props.restaurant.user_image_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm text-white border-2 border-white shadow-sm">
                        {props.restaurant.user_name ? props.restaurant.user_name.charAt(0) : "?"}
                      </div>
                    )}
                    <span className="font-bold">{props.restaurant.user_name}</span>
                  </button>
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
                    {auth.currentUser?.email === "guest@guest.co.jp" ? (
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
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="md:w-1/2">
              <h3 className="mb-4 text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">みんなのレビュー</h3>
              {props.isReviewLoading ? <div className="text-primary-500 animate-pulse font-bold">レビューを読み込み中........</div> :
                <div className="space-y-4">
                  {props.reviews.length > 0 ?
                    <div className='pr-2 overflow-auto max-h-[65vh] scrollbar-hide'>
                      {Object.keys(props.reviews).map((review_item_str) => {
                        const review_item = Number(review_item_str);
                        return (
                          <div key={review_item} className="p-5 mb-4 transition-all border border-gray-100 shadow-sm bg-gray-50 rounded-2xl hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                              <button 
                                onClick={() => openUserProfile(props.reviews[review_item])}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-left"
                              >
                                {props.reviews[review_item].user_image_url ? (
                                  <img src={props.reviews[review_item].user_image_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                                ) : (
                                  <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-gray-300 rounded-full border-2 border-white shadow-md">
                                    {props.reviews[review_item].user_name ? props.reviews[review_item].user_name.charAt(0) : "名"}
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-800 text-base">{props.reviews[review_item].user_name}</span>
                                  <span className="star5_rating text-xs" data-rate={props.reviews[review_item].evaluation}></span>
                                </div>
                              </button>
                            </div>
                            
                            {props.reviews[review_item].image_url && (
                              <div 
                                className="mb-3 w-full h-48 rounded-xl overflow-hidden border border-gray-100 bg-gray-100 relative flex items-center justify-center cursor-pointer group"
                                onClick={() => props.openImageLightbox(props.reviews[review_item].image_url)}
                              >
                                <img src={props.reviews[review_item].image_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 group-hover:opacity-50 transition-opacity" />
                                <img src={props.reviews[review_item].image_url} alt="Review" className="relative z-10 max-w-full max-h-full object-contain" />
                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                  <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">画像を拡大</span>
                                </div>
                              </div>
                            )}

                            <p className="review mb-3 text-gray-700 whitespace-pre-wrap leading-relaxed">{props.reviews[review_item].content}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <DateTimeConverter created_at={props.reviews[review_item].created_at} />
                                {props.reviews[review_item].created_at !== props.reviews[review_item].updated_at && <span>[編集済]</span>}
                              </div>

                              {props.reviews[review_item].email === auth.currentUser?.email &&
                                <div className="flex gap-2">
                                  <button 
                                    className="px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors" 
                                    onClick={() => onReviewEditDialog((review_item))}
                                  >
                                    ✍️ 編集する
                                  </button>
                                  <button 
                                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" 
                                    onClick={() => handleReviewDeleteSubmit((review_item))}
                                  >
                                    🗑️ 削除
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

      {profileModalUser && (
        <UserProfileModal
          isOpen={profileModalIsOpen}
          onClose={() => setProfileModalIsOpen(false)}
          userInfo={profileModalUser}
          setUserInfo={() => {}} // Read-only, no need to update
          isReadOnly={profileModalUser.email !== auth.currentUser?.email}
        />
      )}
    </div>
  )
}

export default ShowRestrauntModal;
