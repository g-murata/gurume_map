import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { postCreateUser } from '../apis/users';

export const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (event) => {

    event.preventDefault();
    const { name, email, password } = event.target.elements;
    if (name.value.length > 10) {
      setError('ニックネームは10文字以内でおなしゃす！');
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
    <div class="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            ニックネーム（10文字以内）
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="ニックネーム" name="name" />
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            メールアドレス
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="メールアドレス" name="email" />
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            パスワード
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="パスワード" name="password" />
        </div>
        <div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">登録</button>
        </div>
      </form>
    </div>
  );
};

