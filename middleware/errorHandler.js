const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error
    let error = { ...err };
    error.message = err.message;

    // MySQL error handling
    if (err.code === 'ER_DUP_ENTRY') {
        const message = 'Duplicate entry found';
        error = { message, statusCode: 400 };
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        const message = 'Referenced record not found';
        error = { message, statusCode: 400 };
    }

    // Validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;