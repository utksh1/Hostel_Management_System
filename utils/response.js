const sendResponse = (res, statusCode, data = null, message = '') => {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    res.status(statusCode).json(response);
};

module.exports = { sendResponse };