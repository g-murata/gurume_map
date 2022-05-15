export const Blog = () => {
  return (
    <>
      <div class="flex items-center flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:flex-row md:space-x-8">

        <div class="max-w-sm rounded overflow-hidden shadow-lg 
              transform hover:scale-110 transition-transform cursor-pointer"
              onClick = {() =>alert("いつか投稿予定")}>
          <img
              class="w-full"
              src="https://source.unsplash.com/random/1600x900/"
              alt="ほげほげ画像"
            ></img>          
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">工事中</div>
              <p class="text-gray-700 text-base">
              </p>
            </div>
        </div>

      </div>      
    </>
)
}