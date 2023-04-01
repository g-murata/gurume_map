export const About = () => {
  return (
    <>
      <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <div className="md:px-3 p-3 ">
          <div className="md:text-lg text-gray-600 text-sm">
            <h1 className="text-lg bg-green-300">GurumeMapとは？</h1>
            <p>新橋付近の飲食店のレビューをすることができるアプリです。</p>
            <p>レビューを投稿する場合は新規会員登録が必要です。</p>
            <p>※会員登録しなくても、ゲストユーザでログインすればレビューを閲覧することだけ可能。</p>
            <br></br>
          </div>
          <h1 className="text-lg bg-orange-300">使用している技術</h1>
          <div className="md:text-lg text-gray-600 text-sm">
            <p>フロントエンド：React</p>
            <p>CSSフレームワーク：Tailwind CSS</p>
            <p>バックエンド：Ruby on Rails</p>
            <p>データベース：PostgreSQL</p>
            <p>ユーザ認証機能：Firebase Authentication</p>
            <br></br>
            <p>＜デプロイ先＞</p>
            <p>フロントエンド：netlify</p>
            <p>バックエンド：heroku → fly.io（Herokuが無料プランを終了したため。）</p>
          </div>
          <div className="flex items-center flex-col">
            <img src={`${process.env.PUBLIC_URL}/Technology.jpg`} className="md:w-2/4" alt="HowToUse_1" />
          </div>
        </div>
      </div>
    </>
  )
}
