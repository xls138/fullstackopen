export const setBlogs = (blogs) => {
    return {
        type: 'SET_BLOGS',
        payload: blogs,
    };
};

export const addBlogToStore = (blog) => {
    return {
        type: 'ADD_BLOG',
        payload: blog,
    };
};

export const likeBlogInStore = (blog) => {
    return {
        type: 'LIKE_BLOG',
        payload: blog,
    };
}

export const deleteBlogFromStore = (blog) => {
    return {
        type: 'DELETE_BLOG',
        payload: blog,
    };
}

export const addCommentToBlog = (blogId, comment) => {
    return {
        type: 'ADD_COMMENT',
        payload: { blogId, comment },
    };
};