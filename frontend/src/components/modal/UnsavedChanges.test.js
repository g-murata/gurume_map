import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Main } from '../Main';
import { fetchRestaurants } from '../../apis/restraunts';
import { fetchTags } from '../../apis/tags';
import { fetchAreas } from '../../apis/areas';
import { GetLatestReviews } from '../../apis/reviews';

// APIのモック
jest.mock('../../apis/restraunts');
jest.mock('../../apis/tags');
jest.mock('../../apis/areas');
jest.mock('../../apis/reviews');

// Firebase Authのモック
jest.mock('../../firebase', () => ({
  auth: {
    currentUser: { email: 'test@example.com' }
  }
}));

// Google Maps APIのモック
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onClick }) => (
    <div data-testid="google-map" onClick={(e) => onClick({ latLng: { lat: () => 35.6, lng: () => 139.7 } })}>
      {children}
    </div>
  ),
  LoadScript: ({ children }) => <div>{children}</div>,
  Marker: () => <div data-testid="marker" />,
  InfoWindow: ({ children }) => <div data-testid="info-window">{children}</div>,
}));

// Modalのモック（onRequestCloseのテスト用）
jest.mock('react-modal', () => {
  const Modal = ({ children, isOpen, onRequestClose }) => (
    isOpen ? (
      <div data-testid="modal-overlay" onClick={onRequestClose}>
        <div data-testid="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    ) : null
  );
  Modal.setAppElement = () => {};
  return Modal;
});

describe('Unsaved Changes Warning', () => {
  const mockRestaurants = { restraunts: [] };
  const mockTags = { tags: [{ id: 1, name: '和食' }] };
  const mockAreas = { areas: [{ id: 1, name: '新橋' }, { id: 2, name: '赤坂見附' }] };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchRestaurants.mockResolvedValue(mockRestaurants);
    fetchTags.mockResolvedValue(mockTags);
    fetchAreas.mockResolvedValue(mockAreas);
    GetLatestReviews.mockResolvedValue({ review: {}, restraunt: {} });
    
    // window.confirmのモック
    window.confirm = jest.fn();
  });

  test('入力がある場合にモーダルを閉じようとすると確認ダイアログが表示されること', async () => {
    window.confirm.mockReturnValue(false); // 「キャンセル」を選択
    
    render(<Main />);
    
    // ローディングが消えるのを待つ
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    
    // モーダルを開く（マップクリックをシミュレート）
    const map = screen.getByTestId('google-map');
    fireEvent.click(map);
    
    await waitFor(() => expect(screen.getByTestId('modal-content')).toBeInTheDocument());
    
    // 入力する
    const input = screen.getByLabelText(/店名/);
    await userEvent.type(input, 'あ');
    
    // モーダル外（オーバーレイ）をクリックして閉じようとする
    fireEvent.click(screen.getByTestId('modal-overlay'));
    
    // confirmが呼ばれたことを確認
    expect(window.confirm).toHaveBeenCalledWith("書きかけの内容がありますが、閉じてもよろしいですか？");
    
    // モーダルがまだ開いていることを確認（confirmでキャンセルしたため）
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  test('確認ダイアログでOKを押すとモーダルが閉じること', async () => {
    window.confirm.mockReturnValue(true); // 「OK」を選択
    
    render(<Main />);
    
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    fireEvent.click(screen.getByTestId('google-map'));
    
    await waitFor(() => expect(screen.getByTestId('modal-content')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/店名/), 'あ');
    
    fireEvent.click(screen.getByTestId('modal-overlay'));
    
    expect(window.confirm).toHaveBeenCalled();
    // モーダルが閉じていることを確認
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  test('何も入力していない場合は確認ダイアログが出ずに閉じること', async () => {
    render(<Main />);
    
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    fireEvent.click(screen.getByTestId('google-map'));
    
    await waitFor(() => expect(screen.getByTestId('modal-content')).toBeInTheDocument());
    
    // 何も入力せずに閉じる
    fireEvent.click(screen.getByTestId('modal-overlay'));
    
    expect(window.confirm).not.toHaveBeenCalled();
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });
});
