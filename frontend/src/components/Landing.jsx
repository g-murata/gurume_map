import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <>
        <div class="flex flex-col justify-center items-center sm:flex-row">
          <Link to="/signup" className="m-16 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-2xl" >新規会員登録</Link>
          <Link to="/login" className="m-16 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg text-2xl" >ログイン</Link>
        </div>
    </>
  )
}
