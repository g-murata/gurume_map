import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Firebase Authのモック
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

// react-router-domのuseNavigateをモック化
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// firebase/app の初期化を回避するために firebase モジュール全体を必要に応じてモック
jest.mock('../firebase', () => ({
  auth: {},
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ログインフォームが正しくレンダリングされること', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('ログイン', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログインする' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ゲストユーザーでログイン' })).toBeInTheDocument();
  });

  test('正しい情報を入力してログインすると、トップページへ遷移すること', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({}); // 成功を模倣

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'password123');
    
    fireEvent.submit(screen.getByRole('button', { name: 'ログインする' }).closest('form'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('パスワードが間違っている場合、エラーメッセージが表示されること', async () => {
    // Firebaseのエラーを模倣
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'wrongpassword');
    
    fireEvent.submit(screen.getByRole('button', { name: 'ログインする' }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('パスワードに誤りがあります。')).toBeInTheDocument();
    });
  });

  test('ゲストログインボタンをクリックするとログイン処理が走ること', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const guestButton = screen.getByRole('button', { name: 'ゲストユーザーでログイン' });
    await userEvent.click(guestButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });
});
