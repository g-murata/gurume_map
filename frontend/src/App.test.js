jest.mock('./firebase', () => ({
  auth: {
    currentUser: null,
  },
  // auth: {
  //   currentUser: {
  //     email: 'test@example.com',
  //     uid: 'test-user-id',
  //   },
  // },  
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
    callback(null); 
    // callback({
    //   email: 'test@example.com',
    //   uid: 'test-user-id',
    // });    
    return () => {

    };
  });
});

import { render, screen} from '@testing-library/react';
import App from './App';

test('初期表示確認', async () => {
  render(<App />);
  expect(await screen.findByText(/GurumeMap/i)).toBeInTheDocument();
});