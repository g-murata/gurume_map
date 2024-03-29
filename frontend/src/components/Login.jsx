import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            setError('正しいメールアドレスの形式で入力してください。');
            break;
          case 'auth/user-not-found':
            setError('入力されたメールアドレスは存在しないみたいです。');
            break;
          case 'auth/wrong-password':
            setError('パスワードに誤りがあります。');
            break;
          default:
            setError('エラー！！');
            break;
        }
      }
      )
  };

  const guestLogin = (event) => {
    signInWithEmailAndPassword(auth, "guest@guest.co.jp", process.env.REACT_APP_GUEST_LOGIN)
      .then(() => {
        navigate('/');
      })
  }

  return (
    <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2" for="email">
            メールアドレス
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" id="email" placeholder="メールアドレス" name="email" />
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2" for="password">
              パスワード
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" name="password" placeholder="パスワード" />
          </div>
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">ログイン</button>
          </div>
          {/* <div>
            ユーザ登録は<Link to={'/signup'}>こちら</Link>から
          </div> */}
        </div>
      </form >
      <button className="text-yellow-500 active:text-yellow-700 text-lg font-semibold block" onClick={guestLogin}>ゲストユーザでログイン</button>
      <div className="text-center py-8">
        <Link to="/" className="text-blue-700 hover:text-blue-500 active:text-blue-300 text-lg font-semibold block" >戻る</Link>            
      </div>

    </div >

  );

};

