import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditRestrauntModal } from './EditRestrauntModal';
import { ShowRestrauntModal } from './ShowRestrauntModal';
import { updateRestraunt } from '../../apis/restraunts';
import { updateReview } from '../../apis/reviews';
import { deleteTagsTaggedItem } from '../../apis/tags_tagged_items';

// Mock APIs
jest.mock('../../apis/restraunts');
jest.mock('../../apis/reviews');
jest.mock('../../apis/tags_tagged_items');

// Mock Firebase Auth
jest.mock('../../firebase', () => ({
  auth: {
    currentUser: {
      email: 'test@example.com'
    }
  }
}));

const mockRestaurant = {
  id: 1,
  name: 'Test Restaurant',
  url: 'http://test.com',
  description: 'Test description',
  image_url: 'http://test.com/image.jpg',
  lat: 35.0,
  lng: 139.0,
  user_email: 'test@example.com',
  user_name: 'Test User'
};

const mockReviews = [
  {
    id: 101,
    evaluation: 4,
    content: 'Good food',
    image_url: 'http://test.com/review.jpg',
    email: 'test@example.com',
    user_name: 'Test User',
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  }
];

describe('EditRestrauntModal Image Deletion', () => {
  const mockProps = {
    restaurant: mockRestaurant,
    selectedItem: 1,
    tags: {},
    tags_tagged_items: {},
    setIsLoading: jest.fn(),
    onSelect: jest.fn(),
    setIsDirty: jest.fn(),
    setEditModalIsOpen: jest.fn(),
    setError: jest.fn(),
    restaurants: [],
    setRestraunt: jest.fn(),
    handleClear: jest.fn(),
    onCloseDialog: jest.fn(),
    onCloseEditDialog: jest.fn(),
    openImageLightbox: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should pass delete_image: true when the checkbox is checked and submitted', async () => {
    updateRestraunt.mockResolvedValue({
      restraunts: { ...mockRestaurant, image_url: null }
    });
    deleteTagsTaggedItem.mockResolvedValue({});

    render(<EditRestrauntModal {...mockProps} />);

    const checkbox = screen.getByLabelText('現在の写真を削除する');
    fireEvent.click(checkbox);

    const submitButton = screen.getByRole('button', { name: '更新する' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateRestraunt).toHaveBeenCalledWith(expect.objectContaining({
        delete_image: true
      }));
    });
  });

  test('should pass delete_image: false when the checkbox is not checked', async () => {
    updateRestraunt.mockResolvedValue({
      restraunts: mockRestaurant
    });
    deleteTagsTaggedItem.mockResolvedValue({});

    render(<EditRestrauntModal {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: '更新する' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateRestraunt).toHaveBeenCalledWith(expect.objectContaining({
        delete_image: false
      }));
    });
  });
});

describe('ShowRestrauntModal Review Image Deletion', () => {
  const mockProps = {
    restaurant: mockRestaurant,
    reviews: mockReviews,
    setReview: jest.fn(),
    setEvaluation: jest.fn(),
    evaluation: 4,
    onChange: jest.fn(),
    setIsDirty: jest.fn(),
    setError: jest.fn(),
    openImageLightbox: jest.fn(),
    onCloseDialog: jest.fn(),
    onEditDialog: jest.fn(),
    handleDeleteSubmit: jest.fn(),
    OpenReviewModal: jest.fn(),
    setCheckUsersWithoutReviews: jest.fn(),
    ReactStarsRating: ({ value }) => <div data-testid="stars">{value}</div>,
    isCheckUserReviewLoading: false,
    checkUsersWithoutReviews: false,
    isReviewLoading: false,
    tags: {},
    tags_tagged_items: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should pass delete_image: true when review image deletion checkbox is checked', async () => {
    updateReview.mockResolvedValue({
      reviews: { ...mockReviews[0], image_url: null }
    });

    render(<ShowRestrauntModal {...mockProps} />);

    // Click "Edit" button for the review
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[1]); 

    // Now in edit mode, find the checkbox
    const checkbox = screen.getByLabelText('現在の写真を削除する');
    fireEvent.click(checkbox);

    // Submit the update
    const updateButton = screen.getByRole('button', { name: '更新する' });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateReview).toHaveBeenCalledWith(expect.objectContaining({
        delete_image: true
      }));
    });
  });
});
