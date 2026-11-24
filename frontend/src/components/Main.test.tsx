import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Main } from './Main';
import { fetchRestaurants } from '../apis/restraunts';
import { fetchTags } from '../apis/tags';
import { fetchAreas } from '../apis/areas';
import { GetLatestReviews, fetchShowReview, CheckUsersWithoutReviews } from '../apis/reviews';

// AuthContextのモック
jest.mock('../context/AuthContext', () => ({
  useAuthContext: () => ({ isDirty: false, setIsDirty: jest.fn() })
}));

// 各種APIのモック
jest.mock('../apis/restraunts');
jest.mock('../apis/tags');
jest.mock('../apis/areas');
jest.mock('../apis/reviews');

// Firebase Authのモック
jest.mock('../firebase', () => ({
  auth: {
    currentUser: { email: 'test@example.com' }
  }
}));

// Google Maps APIのモック
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }: any) => <div data-testid="google-map">{children}</div>,
  LoadScript: ({ children }: any) => <div>{children}</div>,
  Marker: () => <div data-testid="marker" />,
  InfoWindow: ({ children }: any) => <div data-testid="info-window">{children}</div>,
}));

// Modalのモック
jest.mock('react-modal', () => {
  const Modal = ({ children, isOpen }: any) => (isOpen ? <div data-testid="modal">{children}</div> : null);
  (Modal as any).setAppElement = () => {};
  return Modal;
});

const mockRestaurants = {
  restraunts: [
    {
      restaurant: { id: 1, name: 'テストレストランA', area_id: 2, lat: 35.6, lng: 139.7, created_at: '2023-01-01' },
      tags_tagged_items: []
    },
    {
      restaurant: { id: 2, name: 'おいしいお店B', area_id: 2, lat: 35.7, lng: 139.8, created_at: '2023-01-02' },
      tags_tagged_items: []
    }
  ]
};

const mockTags = { tags: [{ id: 1, name: '和食' }, { id: 2, name: '洋食' }] };
const mockAreas = { areas: [{ id: 1, name: '新橋' }, { id: 2, name: '赤坂見附' }] };
const mockUserInfo = { id: 1, name: 'テストユーザー', email: 'test@example.com' };
const mockOpenImageLightbox = jest.fn();

describe('Main Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchRestaurants as jest.Mock).mockResolvedValue(mockRestaurants);
    (fetchTags as jest.Mock).mockResolvedValue(mockTags);
    (fetchAreas as jest.Mock).mockResolvedValue(mockAreas);
    (fetchShowReview as jest.Mock).mockResolvedValue({ review: [] });
    (CheckUsersWithoutReviews as jest.Mock).mockResolvedValue({ review: false });
    (GetLatestReviews as jest.Mock).mockResolvedValue({
      reviews: [
        {
          id: 101,
          evaluation: 5,
          content: '絶品でした！',
          restraunt_id: 1,
          user_id: 1,
          created_at: '2026-03-20T10:00:00Z',
          updated_at: '2026-03-20T10:00:00Z',
          restaurant: {
            id: 1,
            name: 'テストレストランA',
            area_id: 2,
            area_name: '赤坂見附',
            lat: 35.6,
            lng: 139.7
          }
        }
      ]
    });
  });

  test('初期表示でレストランのリストが表示されること', async () => {
    render(<Main userInfo={mockUserInfo} openImageLightboxInApp={mockOpenImageLightbox} />);

    // ローディングが表示されることを確認
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // データ取得後にリストが表示されることを確認
    await waitFor(() => {
      expect(screen.getAllByText('テストレストランA').length).toBeGreaterThan(0);
      expect(screen.getByText('おいしいお店B')).toBeInTheDocument();
    });
  });

  test('店名でフィルタリングができること', async () => {
    render(<Main userInfo={mockUserInfo} openImageLightboxInApp={mockOpenImageLightbox} />);

    await waitFor(() => expect(screen.getAllByText('テストレストランA').length).toBeGreaterThan(0));

    // 検索・フィルターボタンをクリックして検索フォームを表示
    const filterButton = screen.getAllByRole('button', { name: /検索/ })[0];
    fireEvent.click(filterButton);

    const searchInput = screen.getByPlaceholderText('店名で検索...');
    await userEvent.type(searchInput, 'テスト');

    // 'テストレストランA'は残り、'おいしいお店B'は消えるはず
    expect(screen.getAllByText('テストレストランA').length).toBeGreaterThan(0);
    expect(screen.queryByText('おいしいお店B')).not.toBeInTheDocument();
  });

  test('エリア選択でリストが切り替わること', async () => {
    const extendedRestaurants = {
      restraunts: [
        ...mockRestaurants.restraunts,
        {
          restaurant: { id: 3, name: '新橋のお店', area_id: 1, lat: 35.66, lng: 139.75, created_at: '2023-01-03' },
          tags_tagged_items: []
        }
      ]
    };
    (fetchRestaurants as jest.Mock).mockResolvedValue(extendedRestaurants);

    render(<Main userInfo={mockUserInfo} openImageLightboxInApp={mockOpenImageLightbox} />);

    await waitFor(() => expect(screen.getAllByText('テストレストランA').length).toBeGreaterThan(0));

    expect(screen.queryByText('新橋のお店')).not.toBeInTheDocument();

    const areaSelect = screen.getByRole('combobox');
    fireEvent.change(areaSelect, { target: { value: '0' } });

    await waitFor(() => {
      expect(screen.getByText('新橋のお店')).toBeInTheDocument();
    });
  });

  test('最新レビューが表示され、クリックするとモーダルが開くこと', async () => {
    render(<Main userInfo={mockUserInfo} openImageLightboxInApp={mockOpenImageLightbox} />);

    // 最新レビューカルーセルが表示されていることを確認
    await waitFor(() => {
      expect(screen.getByText('最新')).toBeInTheDocument();
      expect(screen.getAllByText('絶品でした！')[0]).toBeInTheDocument();
    });

    // 最新レビューカードをクリック
    const reviewCard = screen.getAllByText('絶品でした！')[0];
    fireEvent.click(reviewCard);

    // モーダルが開くことを確認
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });
});
