import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"
import { fetchBlog } from '../../apis/blog';
import { DateTimeConverter } from '../DateTimeConverter'
import Loading from '../Loading';
import { Blog as BlogType } from '../../types/index';

export const Post: React.FC = () => {
  const [blog, setBlog] = useState<BlogType | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchBlog(id)
        .then((data: any) => {
          // data.blogs or data.blog depending on API
          setBlog(data.blogs || data.blog)
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [id])

  if (!blog && !isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-8">
      {isLoading && <Loading />}
      
      {blog && (
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            ブログ一覧に戻る
          </Link>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mb-12">
            
            {blog.image && (
              <div className="w-full h-64 md:h-96 overflow-hidden bg-gray-100">
                <img 
                  className="object-cover w-full h-full" 
                  src={blog.image} 
                  alt={blog.title} 
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-500 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {blog.created_at && <DateTimeConverter created_at={blog.created_at} />}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-8 leading-tight">
                {blog.title}
              </h1>

              <div className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
                {blog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
