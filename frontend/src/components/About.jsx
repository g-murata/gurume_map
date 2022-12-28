export const About = () => {
  return (
    <>
      <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <div class="md:px-3 p-3 ">
          <h1 class="text-lg bg-green-300">GurumeMapとは？</h1>
          <div class="md:text-lg text-gray-600 text-sm">
            <p>新橋の飲食店を、</p>
            <p>私村田が独断と偏見でレビューしたサイトです。</p>
            <p>評価は5段階となっております。</p>
            <br></br>
          </div>
          <h1 class="text-lg bg-orange-300">使用している技術</h1>
          <div class="md:text-lg text-gray-600 text-sm">
            <p>フロントエンド：React</p>
            <p>CSSフレームワーク：Tailwind CSS</p>
            <p>バックエンド：Ruby on Rails</p>
            <p>データベース：PostgreSQL</p>
            <p>ユーザ認証機能：Firebase Authentication</p>            
            <br></br>
            <p>＜デプロイ先＞</p>
            <p>フロントエンド：netlify</p>
            <p>バックエンド：heroku→無料プラン終了につき移行先検討中</p>
          </div>
        </div>
      </div>
    </>
  )
}
