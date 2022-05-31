import { useParams } from "react-router-dom"
import { Link } from "react-router-dom";

import Blogs from './../../blogs.json';


export function Post()  {
  const { id } = useParams()
  
  const blogs = Blogs.data;
  
  return (
    <>
    <div class="flex flex-col justify-center items-center">
      <div class="flex flex-col justify-center items-center">
        <img class="w-96" src={blogs[id].image} alt="gazou"></img>
      </div>

      <div class="flex flex-col justify-center items-center">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2"> {blogs[id].title}</div>
        </div>

        <div class="text-gray-700 mb-2">
          {blogs[id].created_at}
        </div>

        <div class="w-80 md:w-full break-words whitespace-normal text-gray-800 text-base ">
          <p className="review">{blogs[id].contents}</p>
        </div>

      </div>    
      <br></br>            
      <Link to="/blog" class="text-blue-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block">戻る</Link>
    </div>    
    </>
  )
}    
