import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Main } from './Main';
import { fetchRestaurants } from '../apis/restraunts';
import { fetchTags } from '../apis/tags';
import { fetchAreas } from '../apis/areas';
import { GetLatestReviews } from '../apis/reviews';
import { auth } from '../firebase';

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
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  LoadScript: ({ children }) => <div>{children}</div>,
  Marker: () => <div data-testid="marker" />,
  InfoWindow: ({ children }) => <div data-testid="info-window">{children}</div>,
}));

// Modalのモック（App elementの設定エラー回避）
jest.mock('react-modal', () => {
  const Modal = ({ children, isOpen }) => (isOpen ? <div data-testid="modal">{children}</div> : null);
  Modal.setAppElement = () => {};
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

describe('Main Component', () => {
  beforeEach(() => {
    fetchRestaurants.mockResolvedValue(mockRestaurants);
    fetchTags.mockResolvedValue(mockTags);
    fetchAreas.mockResolvedValue(mockAreas);
    GetLatestReviews.mockResolvedValue({ review: {}, restraunt: {} });
  });

  test('初期表示でレストランのリストが表示されること', async () => {
    render(<Main />);

    // ローディングが表示されることを確認
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // データ取得後にリストが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('テストレストランA')).toBeInTheDocument();
      expect(screen.getByText('おいしいお店B')).toBeInTheDocument();
    });
  });

  test('店名でフィルタリングができること', async () => {
    render(<Main />);

    await waitFor(() => expect(screen.getByText('テストレストランA')).toBeInTheDocument());

    // 検索・フィルターボタンをクリックして検索フォームを表示
    const filterButton = screen.getByRole('button', { name: /検索・フィルター/ });
    fireEvent.click(filterButton);

    const searchInput = screen.getByPlaceholderText('店名で検索...');
    await userEvent.type(searchInput, 'テスト');

    // 'テストレストランA'は残り、'おいしいお店B'は消えるはず
    expect(screen.getByText('テストレストランA')).toBeInTheDocument();
    expect(screen.queryByText('おいしいお店B')).not.toBeInTheDocument();
  });

  test('エリア選択でリストが切り替わること', async () => {
    // 追加のエリア用データ
    const extendedRestaurants = {
      restraunts: [
        ...mockRestaurants.restraunts,
        {
          restaurant: { id: 3, name: '新橋のお店', area_id: 1, lat: 35.66, lng: 139.75, created_at: '2023-01-03' },
          tags_tagged_items: []
        }
      ]
    };
    fetchRestaurants.mockResolvedValue(extendedRestaurants);

    render(<Main />);

    await waitFor(() => expect(screen.getByText('テストレストランA')).toBeInTheDocument());

    // 初期状態（エリアID 2: 赤坂見附）では「新橋のお店」は表示されていないはず
    // 注: Main.jsxのロジックでは areaFilter = restaurant.restaurant.area_id === Number(selectedArea) + 1
    // selectedAreaの初期値は 1 なので、area_id は 2 が表示される
    expect(screen.queryByText('新橋のお店')).not.toBeInTheDocument();

    // エリアを「新橋」（ID: 1）に切り替える
    // AreaListが正しくレンダリングされている前提
    const areaSelect = screen.getByRole('combobox'); // AreaListがselectを使っていると仮定
    fireEvent.change(areaSelect, { target: { value: '0' } }); // index 0 が 新橋(ID 1)

    await waitFor(() => {
      expect(screen.getByText('新橋のお店')).toBeInTheDocument();
      expect(screen.queryByText('テストレストランA')).not.toBeInTheDocument();
    });
  });
});
