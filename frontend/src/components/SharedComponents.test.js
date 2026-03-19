import { render, screen } from '@testing-library/react';
import { DateTimeConverter } from './DateTimeConverter';
import { TagList } from './TagList';
import Loading from './Loading';

describe('Shared Components', () => {
  describe('DateTimeConverter', () => {
    test('ISO形式の日時が正しくフォーマットされること', () => {
      const createdAt = '2023-01-01T10:30:00Z';
      render(<DateTimeConverter created_at={createdAt} />);
      
      // 注意: 環境（タイムゾーン）によって結果が変わる可能性があるため、
      // 厳密な時間を指定するか、あるいはフォーマット形式を確認する
      // ここでは 2023/01/01 が含まれているかを確認
      expect(screen.getByText(/2023\/01\/01/)).toBeInTheDocument();
      expect(screen.getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
    });
  });

  describe('TagList', () => {
    const mockTags = [
      { id: 1, name: 'ラーメン' },
      { id: 2, name: '新宿' }
    ];
    const mockTaggedItems = [
      { tag_id: 1 },
      { tag_id: 2 }
    ];

    test('提供されたタグ名が表示されること', () => {
      render(<TagList tags={mockTags} tags_tagged_items={mockTaggedItems} />);
      
      expect(screen.getByText('ラーメン')).toBeInTheDocument();
      expect(screen.getByText('新宿')).toBeInTheDocument();
    });

    test('存在しないタグIDの場合は何も表示されないこと', () => {
      const invalidTaggedItems = [{ tag_id: 99 }];
      render(<TagList tags={mockTags} tags_tagged_items={invalidTaggedItems} />);
      
      expect(screen.queryByText('ラーメン')).not.toBeInTheDocument();
    });
  });

  describe('Loading', () => {
    test('ローディングスピナーが表示されること', () => {
      render(<Loading />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
});
