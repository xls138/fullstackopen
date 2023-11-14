import { useState } from "react";
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
    <div className="blog" style={blogStyle}>
      <p className="basic">
        {blog.title} {blog.author}
      </p>
      <button onClick={toggleDetails}>
        {detailsVisible ? "hide" : "view"}
      </button>
      {detailsVisible && (
        <div className="details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button className="like" onClick={() => handleLikes(blog)}>
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          <button className="remove" onClick={() => handleRemoving(blog)}>
            remove
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
