import { useParams } from "react-router-dom"

// import Blogs from './../blogs.json';

// const blogs = Blogs.data;
// console.log(blogs)

export function Post()  {
  const { id } = useParams()
  console.log(id)
  
  return (
    <>
    <div class="flex flex-col justify-center items-center">
      <h1>選ばれたのは{id}でした</h1>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() =>alert('しばしまたれい')}>
        しばしまたれい
      </button>
    </div>
    </>
  )
}    
