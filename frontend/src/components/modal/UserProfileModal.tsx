import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { User } from '../../types/index';
import { patchUpdateUser, fetchShowUser } from '../../apis/users';

const customStyles: any = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.50)",
    backdropFilter: "blur(4px)",
    zIndex: 1000
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: "2rem",
    border: "none",
    padding: "0",
    width: "90%",
    maxWidth: "420px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  },
};

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: User;
  setUserInfo: (user: User) => void;
  isReadOnly?: boolean;
  openImageLightbox: (url: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userInfo, setUserInfo, isReadOnly = false, openImageLightbox }) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [currentUser, setCurrentUser] = useState<User>(userInfo);
  const [newName, setNewName] = useState(userInfo.name);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(userInfo.image_url || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setMode('view');
    setError('');
    setNewName(currentUser.name);
    setImageFile(null);
    setPreviewUrl(currentUser.image_url || null);
    onClose();
  };

  const handleEditClick = () => {
    setMode('edit');
    setNewName(currentUser.name);
    setPreviewUrl(currentUser.image_url || null);
  };

  // モーダルが開いた時に最新情報を取得
  useEffect(() => {
    if (isOpen && userInfo.email) {
      fetchShowUser(userInfo.email)
        .then((data: any) => {
          setCurrentUser(data.user);
          setNewName(data.user.name);
          setPreviewUrl(data.user.image_url || null);
          // 自分の情報なら親コンポーネントも更新して同期
          if (!isReadOnly) {
            setUserInfo(data.user);
          }
        })
        .catch(err => console.error("Failed to fetch user stats", err));
    }
  }, [isOpen, userInfo.email, isReadOnly, setUserInfo]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB制限 (10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズが大きすぎます。10MB以内の画像を選択してください。');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNameChanged = newName !== currentUser.name;
    const isImageChanged = imageFile !== null;

    if (!isNameChanged && !isImageChanged) {
      setMode('view');
      return;
    }

    if (newName.length > 10) {
      setError('ニックネームは10文字以内で入力してください。');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await patchUpdateUser(currentUser.id, newName, imageFile);
      setCurrentUser(response.user);
      setUserInfo(response.user);
      setMode('view');
      setImageFile(null);
    } catch (err) {
      setError('更新に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="User Profile Modal"
      ariaHideApp={false}
    >
      <div className="bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
            {mode === 'view' ? 'ユーザープロフィール' : 'プロフィール編集'}
          </h2>
          <button 
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >✕</button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          {mode === 'view' ? (
            <div className="space-y-8">
              {/* User Info Display */}
              <div className="flex flex-col items-center gap-4 mb-8">
                {currentUser.image_url ? (
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => openImageLightbox(currentUser.image_url!)}
                  >
                    <img src={currentUser.image_url} alt={currentUser.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity image-render-smooth" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/40 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">拡大表示</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-500 text-5xl font-bold shadow-inner border-4 border-white">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800">{currentUser.name}</h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">{currentUser.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-3xl text-center border border-gray-100">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">投稿したレビュー</p>
                  <p className="text-2xl font-black text-gray-800">{currentUser.reviews_count || 0} <span className="text-sm font-bold text-gray-400">件</span></p>
                </div>
                <div className="bg-gray-50 p-5 rounded-3xl text-center border border-gray-100">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">登録したお店</p>
                  <p className="text-2xl font-black text-gray-800">{currentUser.restraunts_count || 0} <span className="text-sm font-bold text-gray-400">店</span></p>
                </div>
                <div className="bg-gray-50 p-5 rounded-3xl text-center border border-gray-100 relative overflow-hidden col-span-2">
                  <div className="absolute top-2 right-[-20px] bg-yellow-400 text-[8px] font-black text-white px-6 py-0.5 rotate-45 shadow-sm">
                    COMING SOON
                  </div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">お気に入り</p>
                  <p className="text-2xl font-black text-gray-300">-- <span className="text-sm font-bold text-gray-200">店</span></p>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                {!isReadOnly && currentUser.email !== 'guest@guest.co.jp' && (
                  <button 
                    onClick={handleEditClick}
                    className="bg-white hover:bg-gray-50 text-gray-500 font-bold py-2.5 px-6 rounded-xl border border-gray-200 text-sm transition-all hover:shadow-sm active:translate-y-0"
                  >
                    プロフィールを編集
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 shadow-md group-hover:opacity-75 transition-all image-render-smooth" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-5xl border-4 border-white group-hover:bg-gray-200 transition-all">
                      ?
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-gray-400 font-bold">画像をタップして変更</p>
              </div>

              <div>
                <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-3 ml-1">
                  ニックネーム <span className="text-xs text-gray-300 font-normal ml-1">(10文字以内)</span>
                </label>
                <input
                  autoFocus
                  id="nickname"
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-800 text-lg font-medium focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例: ぐるめ太郎"
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || (newName === currentUser.name && !imageFile)}
                  className={`w-full font-bold py-4 px-6 rounded-2xl shadow-lg transition-all ${
                    loading || (newName === currentUser.name && !imageFile)
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                      : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20 hover:-translate-y-1'
                  }`}
                >
                  {loading ? '保存中...' : '変更を保存する'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('view')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-500 font-bold py-4 px-6 rounded-2xl border-2 border-gray-100 transition-all"
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
