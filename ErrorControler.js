const { TokenExpiredError } = require("jsonwebtoken");
const appError = require("../routs/until/appError");

const handleCastErrorDB = err => {
    const message = ` Invalid ${err.path}: ${err.value}`
    return new appError(message, 404);
}

const handleDuplicateDB = err => {
    const value = err.keyValue.name;
    const message = `Duplicate field value fro / ${value} /  please use anotehr value`;
    return new appError(message, 404)
}

const hanldeValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.messege);
    console.log(errors);
    const message = `Invalid inpute data  ${errors.join('. ')} `
    return new appError(message, 404)
}

const jwtVerificationError = () => new appError('Invalid token please login again', 404);
const tokenExpiredError = () => new appError('Token Expiresd  please login again', 404);

const sendErrordev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status ,
      message: err.message,
      error: err,
      stack: err.stack
    })
};

const sendErrorprod = (err, res) => {
    if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status ,
      message: err.message
    });
}else {

    console.log('EROR', err, err.message)
    res.status(500).json({

        status: 'err',
        message: 'Something went wrong'
    })
}
};
module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    if(process.env.NODE_ENV === 'development'){
        sendErrordev(err, res)
    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};

        if(error.path === '_id') error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateDB(error)
        if(error.name === 'ValidatorError') error = hanldeValidationError(error)
        if(error.name === 'JsonWebTokenError') error = jwtVerificationError()
        if(error.name === 'TokenExpiredError') error = tokenExpiredError()
        sendErrorprod(error, res) 
    }
  }