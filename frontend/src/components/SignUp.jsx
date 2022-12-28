import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (event) => {

    event.preventDefault();
    const { email, password } = event.target.elements;
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      navigate('/');
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('正しいメールアドレスの形式で入力してください。');
          break;
          case 'auth/weak-password':
            setError('パスワードは6文字以上を設定する必要があります。');
            break;
        case 'auth/email-already-in-use':
          setError('そのメールアドレスは登録済みです。');
          break;
        default:
          setError('メールアドレスかパスワードに誤りがあります。');
          break;
      }
    });
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>ユーザ登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス</label>
          <input name="email" type="email" placeholder="email" />
        </div>
        <div>
          <label>パスワード</label>
          <input name="password" type="password" />
        </div>
        <div>
          <button>登録</button>
        </div>
      </form>
    </div>
  );
};

