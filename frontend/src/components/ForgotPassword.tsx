import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (email === 'guest@guest.co.jp') {
      setError('ゲストユーザーのパスワードは再発行できません。');
      setMessage('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      await sendPasswordResetEmail(auth, email);
      setMessage('パスワード再設定用のメールを送信しました。メールボックスを確認してください。※メールが届かない場合は、お手数ですが「迷惑メールフォルダ」もご確認ください。');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('正しいメールアドレスの形式で入力してください。');
          break;
        case 'auth/user-not-found':
          setError('入力されたメールアドレスは登録されていないようです。');
          break;
        default:
          setError('エラーが発生しました。しばらくしてから再度お試しください。');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 bg-gray-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4 tracking-tight">
          パスワード再発行
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
          ご登録済みのメールアドレスを入力してください。<br/>
          パスワード再設定用のリンクをお送りします。
        </p>

        {message && (
          <div className="mb-6 text-sm font-bold text-green-600 bg-green-50 p-4 rounded-xl text-center border border-green-100">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 text-sm font-bold text-red-500 bg-red-50 p-4 rounded-xl text-center border border-red-100">
            {error}
          </div>
        )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className={`w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:-translate-y-0.5 transition-all duration-200 mt-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '送信中...' : '再設定メールを送信する'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <Link
            to="/login"
            className="text-gray-500 hover:text-primary-600 text-sm font-semibold transition-colors"
          >
            ← ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  );
};
