import { useState, useEffect } from "react";
import { useParams, useRouteMatch } from "react-router-dom"
import { Link } from "react-router-dom";


import { fetchBlog } from '../../apis/blog';


export const Post = () => {
  const [blog, setBlog] = useState([])
  const { id } = useParams()

  useEffect(() => {
    console.log("↓↓↓↓↓")
    console.log(id)
    console.log("↑↑↑↑↑")

    fetchBlog(id)
      .then((data) =>
        setBlog(data.blogs)
      )
  }, [])

  return (
    <>
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-col justify-center items-center">
          <img class="w-96" src={blog.image} alt="gazou"></img>
        </div>

        <div class="flex flex-col justify-center items-center">
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2"> {blog.title}</div>
          </div>

          <div class="text-gray-700 mb-2">
            {blog.created_at}
          </div>

          <div class="w-80 md:w-full break-words whitespace-normal text-gray-800 text-base ">
            <p className="review">{blog.contents}</p>
          </div>

        </div>
        <br></br>
        <Link to="/blog" class="text-blue-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block">戻る</Link>
      </div>
    </>
  )
}    
