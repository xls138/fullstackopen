const userReducer = (state = null, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return action.data;
        case 'USER_LOGOUT':
            return null;
        default:
            return state;
    }
};

export default userReducer;