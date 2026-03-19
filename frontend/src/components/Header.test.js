import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import { useAuthContext } from '../context/AuthContext';
import { signOut } from 'firebase/auth';

// Firebase Authのモック
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
  getAuth: jest.fn(),
}));

// AuthContextのモック
jest.mock('../context/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

// firebase/app の初期化を回避
jest.mock('../firebase', () => ({
  auth: {},
}));

describe('Header Component', () => {
  const mockSetUserRegistered = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('非ログイン時に「ログイン」と「新規会員登録」ボタンが表示されること', () => {
    useAuthContext.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <Header setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    expect(screen.getAllByText('ログイン')[0]).toBeInTheDocument();
    expect(screen.getAllByText('新規会員登録')[0]).toBeInTheDocument();
    expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
  });

  test('ログイン時にユーザー名と「ログアウト」ボタンが表示されること', () => {
    useAuthContext.mockReturnValue({ user: { email: 'test@example.com' } });
    const userInfo = { name: 'テストユーザー' };

    render(
      <BrowserRouter>
        <Header userInfo={userInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    expect(screen.getAllByText('ログアウト')[0]).toBeInTheDocument();
    expect(screen.queryByText('ログイン')).not.toBeInTheDocument();
  });

  test('userInfoがないログイン時に「名無しさん」が表示されること', () => {
    useAuthContext.mockReturnValue({ user: { email: 'test@example.com' } });

    render(
      <BrowserRouter>
        <Header userInfo={null} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    expect(screen.getByText('名無しさん')).toBeInTheDocument();
  });

  test('ログアウトボタンをクリックするとsignOutが呼ばれること', () => {
    useAuthContext.mockReturnValue({ user: { email: 'test@example.com' } });

    render(
      <BrowserRouter>
        <Header setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    const logoutButton = screen.getAllByText('ログアウト')[0];
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalled();
    expect(mockSetUserRegistered).toHaveBeenCalledWith(false);
  });
});
