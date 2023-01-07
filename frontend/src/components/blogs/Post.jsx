import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom";


import { fetchBlog } from '../../apis/blog';


export const Post = () => {
  const [blog, setBlog] = useState([])
  const { id } = useParams()

  useEffect(() => {
    fetchBlog(id)
      .then((data) =>
        setBlog(data.blogs)
      )
  }, [id])

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <img className="w-96" src={blog.image} alt="gazou"></img>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2"> {blog.title}</div>
          </div>

          <div className="text-gray-700 mb-2">
            {blog.created_at}
          </div>

          <div className="w-80 md:w-full break-words whitespace-normal text-gray-800 text-base ">
            <p className="review">{blog.content}</p>
          </div>

        </div>
        <br></br>
        <Link to="/blog" className="text-blue-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block">戻る</Link>
      </div>
    </>
  )
}    
