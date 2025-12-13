import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateRestrauntModal } from './CreateRestrauntModal';
import { postRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem } from "../../apis/tags_tagged_items";

// 1. APIモジュールのモック化
// 実際のAPI呼び出しを行わず、テスト用のダミー関数に置き換えます。
jest.mock('../../apis/restraunts');
jest.mock('../../apis/tags_tagged_items');

beforeEach(() => {
    jest.clearAllMocks();

    // デフォルトでPromiseの解決（成功）を返すように設定
    // これで「then」が呼ばれても安全になる
    postRestraunt.mockResolvedValue({}); 
    postTagsTaggedItem.mockResolvedValue({});
});

// フォーム要素のシミュレーションヘルパー関数
const mockSubmitEvent = (formValues = {}) => {
  // formValues = { name: { value: '店名' }, lat: { value: '35.xxxx' }, ... } の形式を想定
  
  const elements = {};
  for (const key in formValues) {
    // フォームの要素として振る舞うオブジェクトを作成
    elements[key] = { value: formValues[key].value };
  }
  
  return {
    preventDefault: jest.fn(), // preventDefaultをモック化
    target: {
      elements: elements,
      // 必要に応じて他のフォームプロパティも追加
    },
  };
};

// 2. 必要なPropsの準備
const mockUser = { email: 'test@example.com' };
const mockTags = [
  { id: 1, name: 'ラーメン' },
  { id: 2, name: 'カレー' },
];
const mockAreas = {
  1: { id: 1, name: '品川' },
};

const mockProps = {
  setIsLoading: jest.fn(),
  restaurants: [],
  setRestraunt: jest.fn(),
  user: mockUser,
  onSelect: jest.fn(),
  closeModal: jest.fn(),
  handleClear: jest.fn(),
  setError: jest.fn(),
  error: '',
  coordinateLat: 35.6895,
  coordinateLng: 139.6917,
  tags: mockTags,
  areas: mockAreas,
  selectedArea: 1, // 品川エリアを選択
};

describe('CreateRestrauntModal', () => {

  beforeEach(() => {
    // 各テストが実行される前にモック関数をリセット
    jest.clearAllMocks();
  });

  // it('1. コンポーネントが正しくレンダリングされ、エリア名が表示されること', () => {
  //   render(<CreateRestrauntModal {...mockProps} />);

  //   expect(screen.getByText('店名')).toBeInTheDocument();
  //   expect(screen.getByText('品川')).toBeInTheDocument();
  //   expect(screen.getByPlaceholderText('店名')).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument();
  // });

  // CreateRestrauntModal.test.jsx (修正後のテストケース1)

  it('1. コンポーネントが正しくレンダリングされ、エリア名が表示されること', () => {
      render(<CreateRestrauntModal {...mockProps} />);

      // エリア名をPropsから取得
      const expectedAreaName = mockAreas[mockProps.selectedArea].name; // '品川'

      expect(screen.getByText('店名')).toBeInTheDocument();
      
      // エリア名の検証
      // ★ getByTextの完全一致検索を避けるため、正規表現を使用するか、
      //   displayValue（入力欄の場合）または findByText（非同期の場合）を検討
      
      // 確実な方法: 正規表現を使って部分一致で検索する
      expect(screen.getByText(new RegExp(expectedAreaName))).toBeInTheDocument(); 

      // または、もしエリア名が入力フィールドに表示されているなら
      // expect(screen.getByDisplayValue(expectedAreaName)).toBeInTheDocument(); 

      expect(screen.getByPlaceholderText('店名')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument();
  });



// CreateRestrauntModal.test.jsx (ケース2の修正)

it('2. 店名が空の場合、バックエンドエラーを検知しエラーメッセージが表示されること', async () => {
    // ----------------------------------------------------
    // 1. API失敗モックの設定 (前回の提案の通り)
    // ----------------------------------------------------
    const mockValidationError = {
      code: 'ERR_BAD_RESPONSE', 
      response: { 
        status: 422,
        data: { error: "Name can't be blank" } 
      },
    };
    postRestraunt.mockRejectedValue(mockValidationError);

    render(<CreateRestrauntModal {...mockProps} />);

    // フォーム要素を見つける (コンポーネントの <form> タグに role="form" があるか確認)
    const form = screen.getByRole('form'); 

    // ----------------------------------------------------
    // 2. ★ フォームデータをカスタムイベントとしてシミュレート (問題の解決策)
    // ----------------------------------------------------
    const customElements = {
        // nameを空文字列として定義
        name: { value: '' }, 
        // 他のフィールドも同様に定義し、コンポーネントがTypeErrorにならないようにする
        lat: { value: String(mockProps.coordinateLat) }, // Propsの値
        lng: { value: String(mockProps.coordinateLng) },
        url: { value: '' },
        description: { value: '' },
    };

    // カスタムイベントオブジェクトを作成
    const mockedEvent = {
        preventDefault: jest.fn(),
        target: {
            elements: customElements, // ここで空ではないデータ構造を注入
        },
    };

    // ----------------------------------------------------
    // 3. fireEvent.submit でカスタムイベントをディスパッチ
    // ----------------------------------------------------
    fireEvent.submit(form, mockedEvent); 

    // ----------------------------------------------------
    // 4. 検証
    // ----------------------------------------------------
    // APIが呼ばれたことを確認 (サーバーバリデーションを待機)
    await waitFor(() => {
        expect(postRestraunt).toHaveBeenCalledTimes(1);
    });
    
    // エラーメッセージが正しく表示されることを確認 (error.code='ERR_BAD_RESPONSE' に基づく)
    await waitFor(() => {
        expect(mockProps.setError).toHaveBeenCalledWith('不備あり！'); // コンポーネントのコードに依存
    });
    
    expect(mockProps.setIsLoading).toHaveBeenCalledWith(false);
});
  



});