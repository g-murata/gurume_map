import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateRestrauntModal from './CreateRestrauntModal';
import { postRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem } from '../../apis/tags_tagged_items';

// APIのモック
jest.mock('../../apis/restraunts');
jest.mock('../../apis/tags_tagged_items');

const mockTags = [
  { id: 1, name: 'ラーメン' },
  { id: 2, name: '新宿' }
];

const mockAreas = [
  { id: 1, name: '新橋' },
  { id: 2, name: '赤坂見附' }
];

const mockUser = { email: 'test@example.com' };

describe('CreateRestrauntModal Component', () => {
  const mockProps = {
    setIsLoading: jest.fn(),
    closeModal: jest.fn(),
    onSelect: jest.fn(),
    setRestraunt: jest.fn(),
    handleClear: jest.fn(),
    setError: jest.fn(),
    restaurants: [],
    user: mockUser,
    tags: mockTags,
    areas: mockAreas,
    selectedArea: 0, // 新橋
    coordinateLat: 35.66,
    coordinateLng: 139.75,
    error: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('正しくレンダリングされ、入力と送信ができること', async () => {
    postRestraunt.mockResolvedValue({
      restraunts: { id: 10, name: '新店', lat: 35.66, lng: 139.75, area_id: 1 },
      user_name: 'テストユーザー'
    });
    postTagsTaggedItem.mockResolvedValue({ tags_tagged_item: { tag_id: 1 } });

    render(<CreateRestrauntModal {...mockProps} />);

    expect(screen.getByText('新規店名登録')).toBeInTheDocument();
    expect(screen.getByText('エリア：新橋')).toBeInTheDocument();

    // 店名入力
    await userEvent.type(screen.getByLabelText(/店名/), 'テストレストラン');

    // タグ付け（アコーディオンを開いて選択）
    const tagButton = screen.getByText('🏷️ タグ付け');
    fireEvent.click(tagButton);
    const ramenTag = await screen.findByText('ラーメン');
    fireEvent.click(ramenTag);

    // 送信
    fireEvent.submit(screen.getByRole('button', { name: 'このお店を登録する' }).closest('form'));

    await waitFor(() => {
      expect(postRestraunt).toHaveBeenCalledWith(expect.objectContaining({
        name: 'テストレストラン',
        area_id: 1,
        email: mockUser.email
      }));
      expect(postTagsTaggedItem).toHaveBeenCalledWith(expect.objectContaining({
        tag_id: 1,
        tagged_item_id: 10
      }));
      expect(mockProps.closeModal).toHaveBeenCalled();
      expect(mockProps.setRestraunt).toHaveBeenCalled();
    });
  });

  test('エラー発生時にsetErrorが呼ばれること', async () => {
    postRestraunt.mockRejectedValue({ code: 'ERR_BAD_RESPONSE' });

    render(<CreateRestrauntModal {...mockProps} />);

    await userEvent.type(screen.getByLabelText(/店名/), '失敗する店');
    fireEvent.submit(screen.getByRole('button', { name: 'このお店を登録する' }).closest('form'));

    await waitFor(() => {
      expect(mockProps.setError).toHaveBeenCalledWith('不備あり！');
    });
  });
});
