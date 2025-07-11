jest.mock('./firebase', () => ({
  auth: {
    currentUser: {
      email: 'test@example.com',
      uid: 'test-user-id',
    },
  },
}));

import { onAuthStateChanged } from "firebase/auth";

jest.mock("firebase/auth", () => {
  const actual = jest.requireActual("firebase/auth"); // 必要なら本物参照
  return {
    __esModule: true,
    ...actual,
    onAuthStateChanged: jest.fn(), // ここで空モック
  };
});

beforeEach(() => {
  onAuthStateChanged.mockImplementation((auth, callback) => {
    console.log("🧪 モック onAuthStateChanged が呼ばれた！");
    callback({
      email: 'test@example.com',
      uid: 'test-user-id',
    });
    return () => {
      console.log("👋 モック unsubscribe");
    };
  });
});

import { render, screen} from '@testing-library/react';
import App from './App';

import { waitForElementToBeRemoved } from '@testing-library/react';

test('初期表示確認', async () => {
  render(<App />);
  const spinner = screen.getByTestId('loading-spinner');
  expect(spinner).toBeInTheDocument();

  // 🔽 ローディングが消えるまで待つ
  await waitForElementToBeRemoved(() => screen.getByTestId('loading-spinner'));

  // ローディングが終わってから他のテストに進む
  expect(await screen.findByText(/GurumeMap/i)).toBeInTheDocument();
});