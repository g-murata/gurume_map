import { render, screen, fireEvent } from '@testing-library/react';
import { LatestReviewsCarousel } from './LatestReviewsCarousel';
import { LatestReview } from '../types/index';

const mockReviews: LatestReview[] = [
  {
    id: 1,
    evaluation: 4.5,
    content: 'とても美味しいラーメンでした。また来ます！',
    restraunt_id: 10,
    user_id: 1,
    image_url: 'https://example.com/ramen.jpg',
    created_at: '2026-03-25T12:00:00Z',
    updated_at: '2026-03-25T12:00:00Z',
    restaurant: {
      id: 10,
      name: 'ラーメン新橋亭',
      area_id: 1,
      area_name: '新橋',
      lat: 35.666,
      lng: 139.758,
    },
  },
  {
    id: 2,
    evaluation: 5,
    content: '最高のステーキ。',
    restraunt_id: 20,
    user_id: 2,
    created_at: '2026-03-24T18:30:00Z',
    updated_at: '2026-03-24T18:30:00Z',
    restaurant: {
      id: 20,
      name: '新宿ステーキハウス',
      area_id: 3,
      area_name: '新宿',
      lat: 35.689,
      lng: 139.700,
    },
  },
];

describe('LatestReviewsCarousel', () => {
  test('レビューが空の場合は何もレンダリングされないこと', () => {
    const { container } = render(
      <LatestReviewsCarousel reviews={[]} onSelectReview={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('レビューカードの情報が正しくレンダリングされること', () => {
    render(
      <LatestReviewsCarousel reviews={mockReviews} onSelectReview={jest.fn()} />
    );

    expect(screen.getByText('最新レビュー')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('ラーメン新橋亭')).toBeInTheDocument();
    expect(screen.getByText('📍 新橋')).toBeInTheDocument();
    expect(screen.getByText('とても美味しいラーメンでした。また来ます！')).toBeInTheDocument();
    expect(screen.getByText('新宿ステーキハウス')).toBeInTheDocument();
    expect(screen.getByText('📍 新宿')).toBeInTheDocument();
  });

  test('カードをクリックするとonSelectReviewが該当のレビューとともに呼ばれること', () => {
    const handleSelectReview = jest.fn();
    render(
      <LatestReviewsCarousel reviews={mockReviews} onSelectReview={handleSelectReview} />
    );

    const card = screen.getByText('ラーメン新橋亭');
    fireEvent.click(card);

    expect(handleSelectReview).toHaveBeenCalledTimes(1);
    expect(handleSelectReview).toHaveBeenCalledWith(mockReviews[0]);
  });

  test('isCollapsibleがtrueのとき最小化ボタンが表示され、トグルできること', () => {
    const handleToggle = jest.fn();
    const { rerender } = render(
      <LatestReviewsCarousel
        reviews={mockReviews}
        onSelectReview={jest.fn()}
        isCollapsible={true}
        isCollapsed={false}
        onToggleCollapse={handleToggle}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /最新レビューを最小化/i });
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledTimes(1);

    // 最小化状態に更新
    rerender(
      <LatestReviewsCarousel
        reviews={mockReviews}
        onSelectReview={jest.fn()}
        isCollapsible={true}
        isCollapsed={true}
        onToggleCollapse={handleToggle}
      />
    );

    expect(screen.queryByText('ラーメン新橋亭')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /最新レビューを展開/i })).toBeInTheDocument();
  });
});
