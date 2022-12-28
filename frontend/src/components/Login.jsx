import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export const Login = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    signInWithEmailAndPassword(auth, email.value, password.value);
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
      <h1>ログイン</h1>
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
    </div>
  );
  }
}
};

