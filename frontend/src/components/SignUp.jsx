import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { postCreateUser } from '../apis/users';

export const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [checkPassword, SetCheckPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handlePasswordCheckSubmit = (event) => {
    event.preventDefault();
    if (password === process.env.REACT_APP_SIGN_UP) {
      SetCheckPassword(true);
    } else {
      alert("パスワードが間違ってます。")
    }
  }

  const handleChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    const { name, email, password } = event.target.elements;
    if (!name.value) {
      setError('ニックネームは必須です！');
      return;
    }
    if (name.value.length > 10) {
      setError('ニックネームは10文字以内でお願いします！');
      return;
    }
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {

        postCreateUser({
          name: name.value,
          email: email.value,
          password: password.value
        })
        navigate('/');

      })
      .catch((error) => {
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
    <>
      {checkPassword ? (
        <>
          <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
            {error ? <p className="py-8" style={{ color: 'red' }}>{error}</p> : <p className="py-8" style={{ color: 'blue' }}>正しいパスワードが入力されました！</p>}
            {/* <p style={{ color: 'red' }}>正しいパスワードが入力されました</p> */}
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
                  ニックネーム（10文字以内）
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="ニックネーム" name="name" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" for="email">
                  メールアドレス
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="メールアドレス" name="email" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
                  パスワード
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="パスワード" name="password" />
              </div>
              <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">登録</button>
              </div>
            </form>
          </div>
        </>
      )
        :
        (
          <div className="bg-pink-100 max-w-lg px-8 mx-auto md:px-8 md:flex-row">
            <form onSubmit={handlePasswordCheckSubmit}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                この先の画面に進むためには暗証番号が必要です。
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" value={password} onChange={handleChange} />
              </label>
              <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full" type="submit" value="送信" />
            </form>
          </ div>
        )}
    </>

  );
};

