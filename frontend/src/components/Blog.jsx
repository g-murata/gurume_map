import { useState, useEffect } from 'react';

import axios from 'axios';
import { fetchBlogs } from '../apis/blogs';
import { Link } from 'react-router-dom';

export const Blog = () => {
  useEffect(() => {
    fetchBlogs()
      .then((data) =>
        console.log(data)
      )
  }, [])
  return (
    <>
      <h1>Hello,Rails</h1>
    </>
  )
}

// export const Blog = () => {


// export const Blog = () => {
//   return (
//     <div class="flex items-center flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:flex-row md:space-x-8">
//       {Object.keys(blogs).map(item => (
//         <>
//           <Link to={`/blog/${blogs[item].id}`}>                      
//             <div class="max-w-sm rounded overflow-hidden shadow-lg 
//                   transform hover:scale-110 transition-transform cursor-pointer">
//             <img
//                 class="w-full"
//                 src={blogs[item].image}
//                 alt="ほげほげ画像"
//               ></img>
//               <div class="px-6 py-4">
//                 <div class="font-bold text-xl mb-2">{blogs[item].title}</div>
//                 <p class="text-gray-700 text-base">
//                 <p class="text-gray-500 text-base">{blogs[item].created_at}</p>
//                 </p>
//               </div>
//             </div>
//           </Link>                                
//         </>
//       ))}    
//     </div>
//   )
// }    
