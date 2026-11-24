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
    created_at: '2026-03-25T00:00:00Z',
    updated_at: '2026-03-25T00:00:00Z',
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
    created_at: '2026-03-20T00:00:00Z',
    updated_at: '2026-03-20T00:00:00Z',
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

  test('一番最新のレビューが日付付きで固定表示され、他のレビューも表示されること', () => {
    render(
      <LatestReviewsCarousel reviews={mockReviews} onSelectReview={jest.fn()} />
    );

    // 1件目の最新固定カード（「最新」バッジと日付）
    expect(screen.getByText('最新')).toBeInTheDocument();
    expect(screen.getByText('3/25')).toBeInTheDocument();
    expect(screen.getByText('ラーメン新橋亭')).toBeInTheDocument();

    // 2件目のカード
    expect(screen.getByText('3/20')).toBeInTheDocument();
    expect(screen.getByText('新宿ステーキハウス')).toBeInTheDocument();
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
});
