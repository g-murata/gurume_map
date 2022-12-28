import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';

export const Login = () => {
  const { user } = useAuthContext();
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
            setError('メールアドレスかパスワードに誤りがあります。');
            break;
          case 'auth/wrong-password':
            setError('メールアドレスかパスワードに誤りがあります。');
            break;
          default:
            setError('メールアドレスかパスワードに誤りがあります。');
            break;
        }
      }
      )
  };

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  };

  { if (user){
    return(
    <div>
      <h1>ログインユーザ： {user.email}</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
    )
  }else{
  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" placeholder="email" />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="password"
          />
        </div>
        <div>
          <button>ログイン</button>
        </div>
        <div>
          ユーザ登録は<Link to={'/signup'}>こちら</Link>から
        </div>
      </form>
      <h1 class="text-blue-500 active:text-yellow-700 text-lg font-semibold block">ただいま開発中！！！！※トップページ行こうとするとloginページにリダイレクトされるけど開発中につき！</h1>
    </div>

  );
  }
}
};

