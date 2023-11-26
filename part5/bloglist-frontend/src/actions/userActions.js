export const loginUser = (user) => {
    return {
        type: 'USER_LOGIN',
        data: user,
    };
};

export const logoutUser = () => {
    return {
        type: 'USER_LOGOUT',
    };
};