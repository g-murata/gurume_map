import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div 
      className="relative flex items-center justify-center h-90vh bg-cover bg-center" 
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ikebukuro.jpg)` }}
    >
      {/* 背景を少し暗くして上に乗る文字やカードを際立たせるオーバーレイ */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* すりガラス風（グラスモーフィズム）のメインカード */}
      <div className="relative z-10 flex flex-col items-center justify-center w-[90%] max-w-2xl p-10 mx-auto bg-white/20 border border-white/30 rounded-3xl shadow-2xl backdrop-blur-md text-center">
        
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white md:text-7xl drop-shadow-lg">
          GurumeMap
        </h1>
        <p className="mb-10 text-lg font-medium text-gray-100 md:text-xl drop-shadow-md">
          新橋周辺のお気に入りを見つけよう
        </p>
        
        {/* ボタンエリア */}
        <div className="flex flex-col w-full gap-4 md:flex-row md:justify-center md:gap-6">
          <Link 
            to="/signup" 
            className="flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg md:w-auto bg-primary-500 rounded-2xl hover:bg-primary-600 hover:shadow-primary-500/40 hover:-translate-y-1"
          >
            新規会員登録
          </Link>
          <Link 
            to="/login" 
            className="flex items-center justify-center w-full px-8 py-4 text-lg font-bold transition-all duration-300 bg-white shadow-lg md:w-auto text-primary-600 rounded-2xl hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}