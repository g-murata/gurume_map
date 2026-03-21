import { render, screen } from '@testing-library/react';
import App from './App';
import { onAuthStateChanged } from 'firebase/auth';

// Firebase Authのモック
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(),
}));

// APIのモック
jest.mock('./apis/users', () => ({
  fetchShowUser: jest.fn(),
}));

// サブコンポーネントを簡単にモック化（ルーティングテストに集中するため）
jest.mock('./components/Main', () => ({ Main: () => <div data-testid="main-page">Main Page</div> }));
jest.mock('./components/Login', () => ({ Login: () => <div data-testid="login-page">Login Page</div> }));
jest.mock('./components/Landing', () => ({ Landing: () => <div data-testid="landing-page">Landing Page</div> }));
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuthContext: jest.fn(),
}));
jest.mock('./components/PrivateRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>, // テスト簡略化のため常に通過させる設定
}));

// Google Maps APIのモック
jest.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Marker: () => <div>Marker</div>,
  InfoWindow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App Routing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null); // 非ログイン状態
      return () => {};
    });
  });

  test('GurumeMap Headerが描画されること', async () => {
    render(<App />);
    
    // Headerは常に表示されるはず
    expect(screen.getByText('GurumeMap')).toBeInTheDocument();
  });
});
