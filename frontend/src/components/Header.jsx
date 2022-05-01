import { useState } from 'react';
import { MdFoodBank } from "react-icons/md"
import { GiHamburgerMenu } from "react-icons/gi"

export const Header = (props) => {
  const [openMenu, setOpenMenu] = useState(false);
  console.log(openMenu);
  const data = props.list;
  console.log(data);

  const menuFunction = () => {
    setOpenMenu(!openMenu);
  };  

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
              <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-500 text-lg font-semibold ">about</a>
              <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold ">blog</a>
              <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold">hogehoge</a>
            </nav>


            {openMenu ? (
            <div className='flex flex-row absolute z-10 top-0 right-0  min-h-fit min-w-full lg:hidden'>
              <div className='basis-1/2'></div>

              <div className='basis-1/2 bg-white'>
                <ul className=' text-center border-l-2 '>
                  <li className='p-2 border-b-2'>
                    <button onClick={menuFunction} className="text-blue-400 hover:text-blue-600 active:text-blue-700 text-lg font-bold ">
                      close
                    </button>
                  </li>
                  <li className='p-2 border-b-2'>
                    <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-500 text-lg font-semibold ">about</a>
                  </li>
                  <li className='p-2 border-b-2'>
                    <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold ">blog</a>
                  </li>
                  <li className='p-2 border-b-2'>
                    <a href="#" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold">hogehoge</a>
                  </li>
                </ul>
              </div>
            </div>
          ) : undefined}

            <button type="button" onClick={menuFunction} class="inline-flex items-center lg:hidden bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2">
              <label className="text-2xl text-gray-600"><GiHamburgerMenu /></label>
            </button>
          </header>

        </div>
      </div>
    </>
  )
}
