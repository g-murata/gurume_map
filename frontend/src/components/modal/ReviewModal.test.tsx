import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReviewModal } from './ReviewModal';
import { postReview, updateReview } from '../../apis/reviews';

// Mock APIs
jest.mock('../../apis/reviews');

const mockRestaurant: any = { id: 1, name: 'Test Restaurant' };
const mockReview: any = { id: 101, evaluation: 4, content: 'Existing content', image_url: 'http://test.com/img.jpg' };

const commonProps: any = {
  restaurant: mockRestaurant,
  setIsDirty: jest.fn(),
  openImageLightbox: jest.fn(),
  closeReviewModal: jest.fn(),
  setError: jest.fn(),
  setIsLoading: jest.fn(),
  setReview: jest.fn(),
  reviews: [],
  ReactStarsRating: ({ value }: any) => <div data-testid="stars">{value}</div>,
  user: { email: 'test@example.com', name: 'Tester' }
};

describe('ReviewModal Consolidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  describe('Create Mode', () => {
    const createProps = {
      ...commonProps,
      mode: 'new',
    };

    test('should render create title and empty content', () => {
      render(<ReviewModal {...createProps} />);
      expect(screen.getByText('新規レビュー登録')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/このお店の良かったところ/)).toHaveValue('');
    });

    test('should call postReview on submit', async () => {
      (postReview as jest.Mock).mockResolvedValue({ review: { id: 102 }, user_name: 'User' });
      render(<ReviewModal {...createProps} />);
      
      fireEvent.change(screen.getByPlaceholderText(/このお店の良かったところ/), { target: { value: 'New review' } });
      const form = screen.getByRole('button', { name: 'レビューを投稿する' }).closest('form');
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(postReview).toHaveBeenCalledWith(expect.objectContaining({
          restraunt_id: 1,
          content: 'New review'
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    const editProps = {
      ...commonProps,
      mode: 'edit',
      review: mockReview,
    };

    test('should render edit title and pre-filled content', () => {
      render(<ReviewModal {...editProps} />);
      expect(screen.getByText('レビュー編集')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing content')).toBeInTheDocument();
    });

    test('should call updateReview on submit', async () => {
      (updateReview as jest.Mock).mockResolvedValue({ reviews: { ...mockReview, content: 'Updated' } });
      render(<ReviewModal {...editProps} />);
      
      fireEvent.change(screen.getByDisplayValue('Existing content'), { target: { value: 'Updated content' } });
      const form = screen.getByRole('button', { name: '更新する' }).closest('form');
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(updateReview).toHaveBeenCalledWith(expect.objectContaining({
          id: 101,
          content: 'Updated content'
        }));
      });
    });

    test('should show confirm on cancel if dirty', () => {
      render(<ReviewModal {...editProps} />);
      fireEvent.change(screen.getByDisplayValue('Existing content'), { target: { value: 'Modified' } });
      fireEvent.click(screen.getByText('キャンセル'));
      expect(window.confirm).toHaveBeenCalled();
    });
  });
});
