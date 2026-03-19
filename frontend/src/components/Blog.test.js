import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Blog } from './Blog';
import { Post } from './blogs/Post';
import { fetchBlogs } from '../apis/blogs';
import { fetchBlog } from '../apis/blog';

// APIのモック
jest.mock('../apis/blogs');
jest.mock('../apis/blog');

const mockBlogs = {
  blogs: [
    { id: 1, title: '初投稿', image: 'test.jpg', created_at: '2023-01-01T10:00:00Z' },
    { id: 2, title: '開発日記', image: 'test2.jpg', created_at: '2023-01-02T10:00:00Z' }
  ]
};

const mockSingleBlog = {
  blogs: { id: 1, title: '初投稿', content: 'こんにちは、これはテストです。', image: 'test.jpg', created_at: '2023-01-01T10:00:00Z' }
};

describe('Blog Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Blog (List)', () => {
    test('ブログ一覧が正しく表示されること', async () => {
      fetchBlogs.mockResolvedValue(mockBlogs);
      render(
        <MemoryRouter>
          <Blog />
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('初投稿')).toBeInTheDocument();
        expect(screen.getByText('開発日記')).toBeInTheDocument();
      });
    });
  });

  describe('Post (Detail)', () => {
    test('ブログ詳細が正しく表示されること', async () => {
      fetchBlog.mockResolvedValue(mockSingleBlog);
      
      render(
        <MemoryRouter initialEntries={['/blog/1']}>
          <Routes>
            <Route path="/blog/:id" element={<Post />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('初投稿')).toBeInTheDocument();
        expect(screen.getByText('こんにちは、これはテストです。')).toBeInTheDocument();
      });
    });
  });
});
