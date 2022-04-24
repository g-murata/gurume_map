import { MdFoodBank } from "react-icons/md"
import { GiHamburgerMenu } from "react-icons/gi"

export const Header = () => {
  return (
    <>
      <div class="bg-white lg:pb-12">
        <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
          <header class="flex justify-between items-center py-4 md:py-8">
            <a href="/" class="inline-flex items-center text-black-800 text-2xl md:text-3xl font-bold gap-2.5">
              GurumeMap
              <label className="text-5xl text-red-600"><MdFoodBank /></label>
            </a>

            <nav class="hidden lg:flex gap-12">
              <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-500 text-lg font-semibold ">
                ほげほげ１
              </a>

              <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold ">
                ほげほげ２
              </a>

              <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold">
                ほげほげ３
              </a>

              <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold">
                ほげほげ４
              </a>
            </nav>

            <button type="button" class="inline-flex items-center lg:hidden bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2">
              <label className="text-2xl text-gray-600"><GiHamburgerMenu /></label>
            </button>
          </header>

        </div>
      </div>
    </>
  )
}
