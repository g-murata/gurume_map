export const About = () => {
  return (
    <>
      <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <h1 class="text-lg bg-green-300">GurumeMapとは？</h1>
        <div class="text-lg text-gray-600">
          <p>新橋の飲食店を、</p>
          <p>私村田が独断と偏見でレビューしたサイトです。</p>
          <p>評価は5段階となっております。</p>
          <br></br>
          <h1 class="text-lg bg-orange-300">使用している技術</h1>
          <p>フロントエンド：React</p>          
          <p>CSSフレームワーク：Tailwind CSS</p>                    
          <p>バックエンド：未使用（Railsを導入予定）</p>                    
          <p>データベース：未使用（PostgreSQLを導入予定）</p>                    
          <p>デプロイ先：netlify（静的サイトホスティングサービス。最初にブランチを連携すれば/・・、後はマスターにプッシュするたび自動でデプロイしてくれます。）</p>                              
          <p>デプロイ先（バックエンド）：heroku（netlifyにRailsのデプロイは出来ないと思うので）</p>                                        
        </div>
      </div>   
    </>
)
}