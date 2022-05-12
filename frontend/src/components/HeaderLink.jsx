import { Link } from 'react-router-dom';

export const HeaderLink = () => {
  return (
    <>      
      <li className='p-2 border-b-2 list-none md:border-none'>
        <Link to="/about" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block">GurumeMapとは</Link>
      </li>             
      <li className='p-2 border-b-2 list-none md:border-none'>
        <Link to="/blog" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block">開発者ブログ</Link>
      </li>  
      <li className='p-2 border-b-2 list-none md:border-none'>
        <Link to="/hogehoge" class="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block">ほげほげ</Link>
      </li>  
    </>
)
}