export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50/30 py-12">
      <div className="max-w-4xl px-4 mx-auto md:px-8">
        
        {/* ページタイトル */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">GurumeMapについて</h1>
          <p className="mt-4 text-gray-500 text-lg">新橋周辺の飲食店レビューをみんなでシェアするアプリ</p>
        </div>

        {/* セクション1: GurumeMapとは？ */}
        <section className="mb-16 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">GurumeMapとは？</h2>
          </div>
          
          <div className="text-gray-600 leading-relaxed mb-8">
            <p className="mb-2">新橋付近の飲食店のレビューをすることができるアプリです。</p>
            <p>お店の閲覧はどなたでも可能ですが、<span className="font-semibold text-primary-600">レビューを投稿する場合は新規会員登録が必要</span>となります。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src={`${process.env.PUBLIC_URL}/HowToUse_1.jpg`} className="w-full object-cover" alt="使い方1" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src={`${process.env.PUBLIC_URL}/HowToUse_2.jpg`} className="w-full object-cover" alt="使い方2" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <img src={`${process.env.PUBLIC_URL}/HowToUse.jpg`} className="w-full object-cover" alt="使い方全体" />
          </div>
        </section>

        {/* セクション2: 使用している技術 */}
        <section className="mb-16 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">使用している技術</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 mb-10">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">アーキテクチャ</h3>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full"></span>フロントエンド：React</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full"></span>CSS：Tailwind CSS</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full"></span>バックエンド：Ruby on Rails</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full"></span>データベース：PostgreSQL</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full"></span>認証：Firebase Authentication</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">デプロイ先</h3>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span>フロントエンド：netlify</li>
                <li className="flex gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></span>
                  <span>バックエンド：heroku<br/><span className="text-sm text-gray-400 font-normal">→ fly.io（Heroku無料プラン終了のため）</span></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-12 max-w-2xl mx-auto">
            <img src={`${process.env.PUBLIC_URL}/Technology.jpg`} className="w-full object-cover" alt="技術構成図" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <h3 className="font-bold text-xl text-gray-800">開発ロードマップ</h3>
            <span className="text-xl">🗺️</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src={`${process.env.PUBLIC_URL}/RoadMap_1.jpg`} className="w-full object-cover" alt="ロードマップ1" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src={`${process.env.PUBLIC_URL}/RoadMap_2.jpg`} className="w-full object-cover" alt="ロードマップ2" />
            </div>
          </div>
        </section>
        
      </div>
    </div>
  )
}