import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom';
import { postCreateUser } from '../apis/users';
import { User } from '../types/index';

interface SignUpProps {
  setUserInfo: (user: { user: User }) => void;
  setUserRegistered: (registered: boolean) => void;
}

export const SignUp: React.FC<SignUpProps> = (props) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [checkPassword, SetCheckPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handlePasswordCheckSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === process.env.REACT_APP_SIGN_UP) {
      SetCheckPassword(true);
    } else {
      alert("パスワードが間違っています。")
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;

    if (!nameInput.value) {
      setError('ニックネームは必須です！');
      return;
    }
    if (nameInput.value.length > 10) {
      setError('ニックネームは10文字以内でお願いします！');
      return;
    }
    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then(() => {
        postCreateUser({
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value
        }).then((user) => {
          props.setUserInfo(user)
          props.setUserRegistered(true)
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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 bg-gray-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
        
        {checkPassword ? (
          <>
            <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2 tracking-tight">新規会員登録</h2>
            <p className="text-center text-primary-500 font-bold text-sm mb-6">合言葉の確認が完了しました！</p>
            
            {error && <p className="mb-6 text-sm font-bold text-red-500 bg-red-50 p-4 rounded-xl text-center">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  ニックネーム <span className="text-xs text-gray-400 font-normal ml-1">(10文字以内)</span>
                </label>
                <input id="username" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" type="text" placeholder="例: ぐるめ太郎" name="name" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  メールアドレス
                </label>
                <input id="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" type="email" placeholder="mail@example.com" name="email" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  パスワード <span className="text-xs text-gray-400 font-normal ml-1">(6文字以上)</span>
                </label>
                <input id="password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" type="password" placeholder="••••••••" name="password" required />
              </div>
              
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:-translate-y-0.5 transition-all duration-200 mt-4">
                登録して始める
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">秘密の合言葉</h2>
            <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed">
              この先の画面に進むためには、<br/>開発者から共有された暗証番号が必要です。
            </p>
            
            <form onSubmit={handlePasswordCheckSubmit} className="space-y-6">
              <div>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-center text-xl tracking-widest text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
                  type="password" 
                  value={password} 
                  onChange={handleChange} 
                  placeholder="合言葉を入力"
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                送信する
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <Link to="/" className="text-gray-500 hover:text-primary-600 text-sm font-semibold transition-colors" >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
};
