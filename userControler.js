const asyncCatch = require('./../routs/until/asyncCatch');
const User = require('./../model/usersModel');


exports.getAllusers = asyncCatch(async(req, res, next) => {

    const Users = await User.find();
    
   res.status(201).json({
       status:'success',
       data:{
           Users
       }
   })
}
)
exports.findUser = (req, res) => {
    res.status(500).json({
        status:'error',
        message: '< this rout is not yet defined>'
    })
}

exports.createNewuser = (req, res) => {
    res.status(500).json({
        status:'error',
        message: '< this rout is not yet defined>'
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status:'error',
        message: '< this rout is not yet defined>'
    })
}

exports.deleteuser = (req, res) => {
    res.status(500).json({
        status:'error',
        message: '< this rout is not yet defined>'
    })
}
