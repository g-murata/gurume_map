import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfileModal } from './UserProfileModal';
import { User } from '../../types/index';

// APIのモック
jest.mock('../../apis/users', () => ({
  patchUpdateUser: jest.fn(),
}));

describe('UserProfileModal Component', () => {
  const mockUser: User = {
    id: 1,
    name: 'テスト太郎',
    email: 'test@example.com',
    reviews_count: 5,
    restraunts_count: 3,
    image_url: 'http://example.com/image.jpg'
  };

  const mockSetUserInfo = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('閲覧モード（自分のプロフィール）で正しく情報が表示されること', () => {
    render(
      <UserProfileModal
        isOpen={true}
        onClose={mockOnClose}
        userInfo={mockUser}
        setUserInfo={mockSetUserInfo}
        isReadOnly={false}
      />
    );

    expect(screen.getByText('ユーザープロフィール')).toBeInTheDocument();
    expect(screen.getByText('テスト太郎')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('5') && element.textContent?.includes('件') === true;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('3') && element.textContent?.includes('店') === true;
    })).toBeInTheDocument();
    expect(screen.getByText('プロフィールを編集する')).toBeInTheDocument();
  });

  test('閲覧モード（他人のプロフィール）で編集ボタンが表示されないこと', () => {
    render(
      <UserProfileModal
        isOpen={true}
        onClose={mockOnClose}
        userInfo={mockUser}
        setUserInfo={mockSetUserInfo}
        isReadOnly={true}
      />
    );

    expect(screen.queryByText('プロフィールを編集する')).not.toBeInTheDocument();
  });

  test('編集ボタンをクリックすると編集モードに切り替わること', () => {
    render(
      <UserProfileModal
        isOpen={true}
        onClose={mockOnClose}
        userInfo={mockUser}
        setUserInfo={mockSetUserInfo}
        isReadOnly={false}
      />
    );

    const editButton = screen.getByText('プロフィールを編集する');
    fireEvent.click(editButton);

    expect(screen.getByText('プロフィール編集')).toBeInTheDocument();
    expect(screen.getByLabelText(/ニックネーム/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('テスト太郎')).toBeInTheDocument();
  });

  test('ゲストユーザー（自分のプロフィール）で編集ボタンが表示されないこと', () => {
    const guestUser = { ...mockUser, email: 'guest@guest.co.jp' };
    render(
      <UserProfileModal
        isOpen={true}
        onClose={mockOnClose}
        userInfo={guestUser}
        setUserInfo={mockSetUserInfo}
        isReadOnly={false}
      />
    );

    expect(screen.queryByText('プロフィールを編集する')).not.toBeInTheDocument();
  });
});
