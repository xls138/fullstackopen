const blogsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_BLOGS':
            return action.payload;
        case 'ADD_BLOG':
            return [...state, action.payload];
        case 'LIKE_BLOG':
            return state.map((blog) => blog.id === action.payload.id ? { ...blog, likes: blog.likes + 1 } : blog);
        case 'DELETE_BLOG':
            return state.filter((blog) => blog.id !== action.payload.id);
        case 'ADD_COMMENT':
            return state.map((blog) =>
                blog.id === action.payload.blogId
                    ? { ...blog, comments: blog.comments.concat(action.payload.comment) } : blog);
        default:
            return state;
    }
};

export default blogsReducer;