import React, { useState } from "react";
const Blog = ({ blog, handleLikes, handleRemoving }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} {blog.author}
      </p>
      <button onClick={toggleDetails}>
        {detailsVisible ? "hide" : "view"}
      </button>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button onClick={() => handleLikes(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          <button onClick={() => handleRemoving(blog)}>remove</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
