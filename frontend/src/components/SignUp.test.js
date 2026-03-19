import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SignUp } from './SignUp';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { postCreateUser } from '../apis/users';

// Firebase Authのモック
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

// APIのモック
jest.mock('../apis/users', () => ({
  postCreateUser: jest.fn(),
}));

// react-router-domのuseNavigateをモック化
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// firebase/app の初期化を回避
jest.mock('../firebase', () => ({
  auth: {},
}));

describe('SignUp Component', () => {
  const mockSetUserInfo = jest.fn();
  const mockSetUserRegistered = jest.fn();
  const CORRECT_PASSCODE = 'secret123';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_SIGN_UP = CORRECT_PASSCODE;
  });

  test('最初は合言葉入力画面が表示されること', () => {
    render(
      <BrowserRouter>
        <SignUp setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    expect(screen.getByText('秘密の合言葉')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('合言葉を入力')).toBeInTheDocument();
  });

  test('正しい合言葉を入力すると新規会員登録フォームが表示されること', async () => {
    render(
      <BrowserRouter>
        <SignUp setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('合言葉を入力');
    await userEvent.type(input, CORRECT_PASSCODE);
    fireEvent.submit(screen.getByRole('button', { name: '送信する' }).closest('form'));

    expect(screen.getByText('新規会員登録')).toBeInTheDocument();
    expect(screen.getByLabelText(/ニックネーム/)).toBeInTheDocument();
  });

  test('バリデーション: ニックネームが10文字を超えるとエラーが表示されること', async () => {
    render(
      <BrowserRouter>
        <SignUp setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    // 合言葉を突破
    await userEvent.type(screen.getByPlaceholderText('合言葉を入力'), CORRECT_PASSCODE);
    fireEvent.submit(screen.getByRole('button', { name: '送信する' }).closest('form'));

    // フォーム入力
    await userEvent.type(screen.getByLabelText(/ニックネーム/), 'あいうえおかきくけこさ'); // 11文字
    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/パスワード/), 'password123');

    fireEvent.submit(screen.getByRole('button', { name: '登録して始める' }).closest('form'));

    expect(screen.getByText('ニックネームは10文字以内でお願いします！')).toBeInTheDocument();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test('正しく入力するとFirebase登録とAPI送信が行われ、トップへ遷移すること', async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
    postCreateUser.mockResolvedValueOnce({ id: 1, name: 'テストユーザー' });

    render(
      <BrowserRouter>
        <SignUp setUserInfo={mockSetUserInfo} setUserRegistered={mockSetUserRegistered} />
      </BrowserRouter>
    );

    // 合言葉を突破
    await userEvent.type(screen.getByPlaceholderText('合言葉を入力'), CORRECT_PASSCODE);
    fireEvent.submit(screen.getByRole('button', { name: '送信する' }).closest('form'));

    // フォーム入力
    await userEvent.type(screen.getByLabelText(/ニックネーム/), 'テストユーザー');
    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/パスワード/), 'password123');

    fireEvent.submit(screen.getByRole('button', { name: '登録して始める' }).closest('form'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
      expect(postCreateUser).toHaveBeenCalledWith({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockSetUserInfo).toHaveBeenCalledWith({ id: 1, name: 'テストユーザー' });
      expect(mockSetUserRegistered).toHaveBeenCalledWith(true);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });
});
