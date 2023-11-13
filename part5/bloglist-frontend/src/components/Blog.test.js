import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog/>', () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 0,
        user: { name: 'Test User' }
    };

    test('renders title and author, but not url or likes by default', async () => {
        const component = render(<Blog blog={blog} />);
        const container = component.container;
        const basic = container.querySelector('.basic');
        expect(basic).not.toHaveStyle('display: none');
        const details = container.querySelector('.details');
        expect(details).toBeNull();
    });

    test('renders url and likes when view button is clicked', async () => {
        const component = render(<Blog blog={blog} />);
        const container = component.container;
        const user = userEvent.setup();
        const button = screen.getByText('view');
        await user.click(button);
        const details = container.querySelector('.details');
        expect(details).not.toHaveStyle('display: none');
    });

    test('clicking like button twice calls event handler twice', async () => {
        const mockHandler = jest.fn();
        render(<Blog blog={blog} handleLikes={mockHandler} />);
        const user = userEvent.setup();
        const viewButton = screen.getByText('view');
        await user.click(viewButton);
        const button = screen.getByText('like');
        await user.click(button);
        await user.click(button);
        expect(mockHandler.mock.calls).toHaveLength(2);
    });
});