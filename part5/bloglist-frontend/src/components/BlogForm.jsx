import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const handleBlogChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleBlogChange}
            placeholder="title"
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={newBlog.author}
            name="author"
            onChange={handleBlogChange}
            placeholder="author"
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleBlogChange}
            placeholder="url"
          />
        </div>
        <button id="create-blog" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
