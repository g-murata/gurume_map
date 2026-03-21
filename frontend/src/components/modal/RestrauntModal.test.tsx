import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RestrauntModal } from './RestrauntModal';
import { postRestraunt, updateRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem, deleteTagsTaggedItem } from '../../apis/tags_tagged_items';

// Mock APIs
jest.mock('../../apis/restraunts');
jest.mock('../../apis/tags_tagged_items');

const mockRestaurant = {
  id: 1,
  name: 'Original Name',
  url: 'http://original.com',
  description: 'Original Description',
  image_url: 'http://test.com/image.jpg',
  lat: 35.0,
  lng: 139.0,
  area_id: 1
};

const commonProps: any = {
  tags: [ { id: 1, name: 'Tag1' } ],
  areas: { 0: { id: 1, name: 'Area1' } },
  selectedArea: 0,
  setIsLoading: jest.fn(),
  onSelect: jest.fn(),
  setIsDirty: jest.fn(),
  setError: jest.fn(),
  setRestraunt: jest.fn(),
  handleClear: jest.fn(),
  openImageLightbox: jest.fn(),
};

describe('RestrauntModal Consolidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  describe('Create Mode', () => {
    const createProps = {
      ...commonProps,
      mode: 'new',
      user: { email: 'test@example.com' },
      coordinateLat: 35.1,
      coordinateLng: 139.1,
      closeModal: jest.fn(),
      restaurants: [],
    };

    test('should render create title and empty fields', () => {
      render(<RestrauntModal {...createProps} />);
      expect(screen.getByText('新規店名登録')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('例：美味しいラーメン屋')).toHaveValue('');
    });

    test('should call postRestraunt on submit', async () => {
      (postRestraunt as jest.Mock).mockResolvedValue({ restraunts: { id: 2, name: 'New' }, user_name: 'User' });
      (postTagsTaggedItem as jest.Mock).mockResolvedValue({ tags_tagged_item: {} });

      render(<RestrauntModal {...createProps} />);
      
      fireEvent.change(screen.getByLabelText(/店名/), { target: { value: 'New Restaurant' } });
      const form = screen.getByRole('button', { name: 'このお店を登録する' }).closest('form');
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(postRestraunt).toHaveBeenCalledWith(expect.objectContaining({
          name: 'New Restaurant',
          email: 'test@example.com'
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    const editProps = {
      ...commonProps,
      mode: 'edit',
      restaurant: mockRestaurant,
      tags_tagged_items: { 1: { tag_id: 1, id: 1, tagged_item_id: 1, tagged_item_type: 'Restraunt' } },
      onCloseEditDialog: jest.fn(),
      onCloseDialog: jest.fn(),
      restaurants: [{ restaurant: mockRestaurant, tags_tagged_items: [] }],
    };

    test('should render edit title and initial values', () => {
      render(<RestrauntModal {...editProps} />);
      expect(screen.getByText('お店の編集')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Original Name')).toBeInTheDocument();
    });

    test('should call updateRestraunt on submit', async () => {
      (updateRestraunt as jest.Mock).mockResolvedValue({ restraunts: { ...mockRestaurant, name: 'Updated' } });
      (deleteTagsTaggedItem as jest.Mock).mockResolvedValue({});
      (postTagsTaggedItem as jest.Mock).mockResolvedValue({ tags_tagged_item: {} });

      render(<RestrauntModal {...editProps} />);
      
      fireEvent.change(screen.getByLabelText(/店名/), { target: { value: 'Updated Restaurant' } });
      const form = screen.getByRole('button', { name: '更新する' }).closest('form');
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(updateRestraunt).toHaveBeenCalledWith(expect.objectContaining({
          id: 1,
          name: 'Updated Restaurant'
        }));
      });
    });

    test('should show confirm dialog on cancel if dirty', () => {
      render(<RestrauntModal {...editProps} />);
      
      fireEvent.change(screen.getByLabelText(/店名/), { target: { value: 'Modified' } });
      fireEvent.click(screen.getByText('詳細画面に戻る'));

      expect(window.confirm).toHaveBeenCalled();
      expect(editProps.onCloseEditDialog).toHaveBeenCalled();
    });

    test('should NOT show confirm dialog on cancel if NOT dirty', () => {
      render(<RestrauntModal {...editProps} />);
      
      fireEvent.click(screen.getByText('詳細画面に戻る'));

      expect(window.confirm).not.toHaveBeenCalled();
      expect(editProps.onCloseEditDialog).toHaveBeenCalled();
    });
  });
});
