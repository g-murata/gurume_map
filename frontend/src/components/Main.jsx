export const Main = () => {
  return (
    <>
      <div class="max-w-screen-2xl px-4 md:px-8 mx-auto lg:flex lg:space-x-8 ">

        <div class="max-w-sm rounded overflow-hidden shadow-lg 
              transform hover:scale-110 transition-transform cursor-pointer">
          <img
              class="w-full"
              src="https://source.unsplash.com/random/1600x900/"
              alt="ほげほげ画像"
            ></img>          
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">ほげほげタイトル</div>
              <p class="text-gray-700 text-base">
              ほげほげ本文
              </p>
            </div>
        </div>

        <div class="max-w-sm rounded overflow-hidden shadow-lg 
              transform hover:scale-110 transition-transform cursor-pointer">
          <img
              class="w-full"
              src="https://source.unsplash.com/random/1600x900/"
              alt="ほげほげ画像"
            ></img>          
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">ほげほげタイトル</div>
              <p class="text-gray-700 text-base">
              ほげほげ本文
              </p>
            </div>
        </div>

      </div>
      
    </>
  )
}
