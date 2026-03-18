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
        console.error(error)
        setIsLoading(false);
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50/30">
      {isLoading && <Loading />}
      
      <div className="max-w-screen-xl px-4 py-12 mx-auto md:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">開発者ブログ</h2>
          <p className="mt-4 text-gray-500">GurumeMapの裏話や開発状況をお届けします</p>
        </div>

        {/* 綺麗なグリッドレイアウトに変更 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {Object.keys(blogs).map(item => (
            <Link key={blogs[item].id} to={`/blog/${blogs[item].id}`} className="group block h-full">
              <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                
                {/* 画像エリア (ホバー時に少しズームする演出) */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    src={blogs[item].image}
                    alt={blogs[item].title}
                  />
                  {/* 画像の上に薄いグラデーションを乗せて高級感を */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* テキストエリア */}
                <div className="flex flex-col flex-grow p-6">
                  <div className="mb-3 text-xs font-semibold text-primary-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <DateTimeConverter created_at={blogs[item].created_at} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {blogs[item].title}
                  </h3>
                </div>
                
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}