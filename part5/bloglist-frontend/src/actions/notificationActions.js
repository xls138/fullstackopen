export const setNotification = (message, type) => {
    return {
        type: 'SET_NOTIFICATION',
        data: { message, type },
    };
};

export const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION',
    };
};