import { createStore, combineReducers } from 'redux';
import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userReducer from './reducers/userReducer';
import usersReducer from './reducers/usersReducer'; 

const reducer = combineReducers({
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
});

const store = createStore(reducer);

export default store;