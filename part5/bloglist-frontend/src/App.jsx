import { useState, useEffect, useRef } from "react";
// import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotification,
  clearNotification,
} from "./actions/notificationActions";
import {
  setBlogs,
  addBlogToStore,
  likeBlogInStore,
  deleteBlogFromStore,
  addCommentToBlog,
} from "./actions/blogActions";
import { loginUser, logoutUser } from "./actions/userActions";
import { Routes, Route, Link, useParams } from "react-router-dom";
import usersService from "./services/users";
import { setUsers } from "./actions/usersActions";
import { Table, ListGroup, Nav } from "react-bootstrap";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();

  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(loginUser(user));
      blogService.setToken(user.token);
      blogService.getAll().then((blogs) => {
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
        dispatch(setBlogs(sortedBlogs));
      });
      usersService.getAll().then((users) => {
        dispatch(setUsers(users));
      });
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(loginUser(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("wrong username or password", "error"));
      setTimeout(() => {
        dispatch(clearNotification());
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
    dispatch(logoutUser());
  };

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const createdBlog = await blogService.create(newBlog);
      dispatch(
        setNotification(
          `New blog added: ${createdBlog.title} by ${createdBlog.author}`,
          "success"
        )
      );
      dispatch(addBlogToStore(createdBlog));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    } catch (exception) {
      dispatch(setNotification("Failed to create blog", "error"));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const handleLikes = async (blog) => {
    try {
      await blogService.update({
        ...blog,
        likes: blog.likes + 1,
      });
      dispatch(likeBlogInStore(blog));
    } catch (exception) {
      dispatch(setNotification("Failed to update blog", "error"));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const handleRemoving = async (blog) => {
    try {
      const result = window.confirm(`Remove ${blog.title} by ${blog.author}`);
      if (result) {
        await blogService.remove(blog.id);
        dispatch(deleteBlogFromStore(blog));
      }
    } catch (exception) {
      dispatch(setNotification("Failed to remove blog", "error"));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const Home = () => {
    return (
      <div>
        {user === null ? null : (
          <div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>
        )}
        <ListGroup>
          {blogs.map((blog) => (
            <ListGroup.Item
              key={blog.id}
              action
              as={Link}
              to={`/blogs/${blog.id}`}
            >
              {blog.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  };

  const User = () => {
    const { userId } = useParams();
    const users = useSelector((state) => state.users);
    const user = users.find((user) => user.id === userId);
    if (!user) {
      return null;
    }
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </div>
    );
  };

  const Users = () => {
    const users = useSelector((state) => state.users);
    return (
      <div>
        <h2>Users</h2>
        <Table striped>
          <thead>
            <tr>
              <th>users</th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const BlogView = () => {
    const [comment, setComment] = useState("");
    const params = useParams();
    const blog = blogs.find((blog) => blog.id === params.id);
    const addComment = async (event) => {
      event.preventDefault();
      try {
        await blogService.createComment(blog.id, { comment });
        dispatch(addCommentToBlog(blog.id, comment));
        dispatch(setNotification(`New comment added: ${comment}`, "success"));
        setTimeout(() => {
          dispatch(clearNotification());
        }, 5000);
      } catch (exception) {
        dispatch(setNotification("Failed to add comment", "error"));
        setTimeout(() => {
          dispatch(clearNotification());
        }, 5000);
      }
    };
    if (!blog) {
      return null;
    }
    return (
      <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <p>
          {blog.likes} likes{" "}
          <button onClick={() => handleLikes(blog)}>like</button>
        </p>
        <p>added by {blog.author}</p>
        <button onClick={() => handleRemoving(blog)}>remove</button>
        <h3>comments</h3>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ul>
        <form onSubmit={addComment}>
          <input
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit">add comment</button>
        </form>
      </div>
    );
  };

  return (
    <div className="container">
      <Nav>
        <Nav.Item>
          <Nav.Link as={Link} to="/">
            home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/users">
            users
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:userId" element={<User />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </div>
  );
};

export default App;
