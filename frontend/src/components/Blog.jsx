import { useState, useEffect } from 'react';

import { fetchBlogs } from '../apis/blogs';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import {DateTimeConverter} from './DateTimeConverter'

export const Blog = () => {
  const [blogs, setBlog] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    fetchBlogs()
      .then((data) => {
        setBlog(data.blogs)
        setIsLoading(false)
      }).catch((error) => {
        setIsLoading(false);
      })
  }, [])

  return (
    <>
      {/* TODO: ローディング画面を作ったら消す。 */}
      {isLoading && <Loading />}
      <div className="flex flex-col px-4 md:px-8 md:flex-row md:flex-wrap">
        <>
          {Object.keys(blogs).map(item => (
            <>
              <Link className="p-3 md:w-1/3" to={`/blog/${blogs[item].id}`}>
                <div className="border-red-700 max-w-sm rounded overflow-hidden shadow-lg 
                    transform hover:scale-110 transition-transform cursor-pointer">
                  <div className="flex justify-center">
                    <img
                      className="h-32 "
                      src={blogs[item].image}
                      alt="ほげほげ画像"
                    ></img>
                  </div>
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{blogs[item].title}</div>
                    <p className="text-gray-700 text-base">
                      <p className="text-gray-500 text-base">
                        <DateTimeConverter 
                          created_at= {blogs[item].created_at}
                        />
                        </p>
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
