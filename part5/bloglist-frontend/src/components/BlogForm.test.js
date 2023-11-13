import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls event handler with correct details when new blog is created', async () => {
    const mockHandler = jest.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={mockHandler} />);
    
    const titleInput = screen.getByPlaceholderText('title');
    const authorInput = screen.getByPlaceholderText('author');
    const urlInput = screen.getByPlaceholderText('url');

    await user.type(titleInput, 'test title');
    await user.type(authorInput, 'test author');
    await user.type(urlInput, 'test url');

    const submitButton = screen.getByRole('button', { name: 'create' });
    await user.click(submitButton);

    expect(mockHandler).toHaveBeenCalledWith({
        title: 'test title',
        author: 'test author',
        url: 'test url',
    });
})