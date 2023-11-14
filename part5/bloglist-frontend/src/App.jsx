import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      blogService.getAll().then((blogs) => {
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
      });
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotification({ message: "wrong username or password", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        handleSubmit={handleLogin}
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />
    </Togglable>
  );

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const createdBlog = await blogService.create(newBlog);
      setNotification({
        message: `New blog added: ${createdBlog.title} by ${createdBlog.author}`,
        type: "success",
      });
      setBlogs([...blogs, createdBlog]);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setNotification({ message: "Failed to create blog", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLikes = async (blog) => {
    try {
      await blogService.update({
        ...blog,
        likes: blog.likes + 1,
      });
      setBlogs(
        blogs.map((b) => (b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))
      );
    } catch (exception) {
      setNotification({ message: "Failed to update blog", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleRemoving = async (blog) => {
    try {
      const result = window.confirm(`Remove ${blog.title} by ${blog.author}`);
      if (result) {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      }
    } catch (exception) {
      setNotification({ message: "Failed to remove blog", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div>
      <Notification message={notification?.message} type={notification?.type} />
      {user === null ? (
          loginForm()
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={handleLikes}
          handleRemoving={handleRemoving}
        />
      ))}
    </div>
  );
};

export default App;
