import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <>
        <div className="flex flex-col h-90vh bg-cover bg-center md:h-80vh md:bg-top" style={{backgroundImage: `url(${`${process.env.PUBLIC_URL}/tokyo.jpg`})`}}>
          <div className="flex-grow pb-24"></div>
          <div class="flex flex-col justify-center pt-4 pr-4 items-center absolute top-2/4 w-full md:flex-row md:top-2/3">
            <Link to="/signup" className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-2xl" >新規会員登録</Link>
            <Link to="/login" className="m-6 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg text-2xl" >ログイン</Link>
          </div>
        </div>
    </>
  )
}
