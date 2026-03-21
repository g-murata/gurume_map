import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;

    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
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
            setError('エラーが発生しました！');
            break;
        }
      })
  };

  const guestLogin = (event: React.MouseEvent) => {
    event.preventDefault();
    if (process.env.REACT_APP_GUEST_LOGIN) {
      signInWithEmailAndPassword(auth, "guest@guest.co.jp", process.env.REACT_APP_GUEST_LOGIN)
        .then(() => {
          navigate('/');
        })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 bg-gray-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          ログイン
        </h2>
        
        {error && <p className="mb-6 text-sm font-bold text-red-500 bg-red-50 p-4 rounded-xl text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              メールアドレス
            </label>
            <input 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
              type="email" 
              id="email" 
              placeholder="mail@example.com" 
              name="email" 
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              パスワード
            </label>
            <input 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
              id="password" 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              required
            />
          </div>
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:-translate-y-0.5 transition-all duration-200 mt-2">
            ログインする
          </button>
        </form >
        
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
          <button 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all duration-200" 
            onClick={guestLogin}
          >
            ゲストユーザーでログイン
          </button>
          <div className="text-center mt-2">
            <Link to="/" className="text-gray-500 hover:text-primary-600 text-sm font-semibold transition-colors">
              ← トップページに戻る
            </Link>            
          </div>
        </div>
      </div>
    </div >
  );
};
