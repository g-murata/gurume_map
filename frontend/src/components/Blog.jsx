import { useState, useEffect } from 'react';

import { fetchBlogs } from '../apis/blogs';
import { Link } from 'react-router-dom';
import Loading from './Loading';

export const Blog = () => {
  const [blogs, setBlog] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    fetchBlogs()
      .then((data) => {
        setBlog(data.blogs)
        setIsLoading(false)
      }
      )
  }, [])

  return (
    <>
      {/* TODO: ローディング画面を作ったら消す。 */}
      {isLoading && <Loading />}
      <div className="flex items-center flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:flex-row md:space-x-8">
        <>
          {Object.keys(blogs).map(item => (
            <>
              <Link to={`/blog/${blogs[item].id}`}>
                <div className="max-w-sm rounded overflow-hidden shadow-lg 
                    transform hover:scale-110 transition-transform cursor-pointer">
                  <img
                    className="w-full"
                    src={blogs[item].image}
                    alt="ほげほげ画像"
                  ></img>
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{blogs[item].title}</div>
                    <p className="text-gray-700 text-base">
                      <p className="text-gray-500 text-base">{blogs[item].created_at}</p>
                    </p>
                  </div>
                </div>
              </Link>
            </>))
          }
        </>
      </div >
    </>
  )
}
