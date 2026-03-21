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
  const mockSetUserInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('非ログイン時に「ログイン」と「新規会員登録」ボタンが表示されること', () => {
    (useAuthContext as jest.Mock).mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <Header userInfo={false} setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    expect(screen.getAllByText('ログイン')[0]).toBeInTheDocument();
    expect(screen.getAllByText('新規会員登録')[0]).toBeInTheDocument();
    expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
  });

  test('ログイン時にユーザー名と「ログアウト」ボタンが表示されること', () => {
    (useAuthContext as jest.Mock).mockReturnValue({ user: { email: 'test@example.com' } });
    const userInfo = { id: 1, name: 'テストユーザー', email: 'test@example.com', reviews_count: 5 };

    render(
      <BrowserRouter>
        <Header userInfo={userInfo} setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    expect(screen.getAllByText('ログアウト')[0]).toBeInTheDocument();
    expect(screen.queryByText('ログイン')).not.toBeInTheDocument();
  });

  test('userInfoがないログイン時に「名無しさん」が表示されること', () => {
    (useAuthContext as jest.Mock).mockReturnValue({ user: { email: 'test@example.com' } });

    render(
      <BrowserRouter>
        <Header userInfo={null} setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    expect(screen.getByText('名無しさん')).toBeInTheDocument();
  });

  test('ログアウトボタンをクリックするとsignOutが呼ばれること', () => {
    (useAuthContext as jest.Mock).mockReturnValue({ user: { email: 'test@example.com' } });

    render(
      <BrowserRouter>
        <Header userInfo={null} setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    const logoutButton = screen.getAllByText('ログアウト')[0];
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalled();
    expect(mockSetUserRegistered).toHaveBeenCalledWith(false);
  });

  test('ニックネームをクリックすると変更モーダルが開くこと', () => {
    (useAuthContext as jest.Mock).mockReturnValue({ user: { email: 'test@example.com' } });
    const userInfo = { id: 1, name: 'テストユーザー', email: 'test@example.com', reviews_count: 5 };

    render(
      <BrowserRouter>
        <Header userInfo={userInfo} setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    const nameButton = screen.getByText('テストユーザー');
    fireEvent.click(nameButton);

    expect(screen.getByText('ユーザープロフィール')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('5') && element.textContent?.includes('件') === true;
    })).toBeInTheDocument();
    expect(screen.getByText('ニックネームを変更する')).toBeInTheDocument();
  });
});
