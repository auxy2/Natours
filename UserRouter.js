const express = require('express');
const userC = require('./../controler/userControler');
const authColler = require('./../controler/authController');

const  router = express.Router()

router.post('/signUp', authColler.singUp);
router.post('/login', authColler.login);

router.post('/forgetpassword', authColler.forgetPasword);
router.post('/resetpassword/:token', authColler.resetPassword);
router.patch('/updatepassword', authColler.protect,authColler.updatePassword);
router.patch('/updateuser', authColler.protect,userC.updateMe);
router.patch('/updateMe', authColler.protect,authColler.updateProfile);
router.get('/addBank', authColler.addbank);
router.get('/bitcoreTest', authColler.bitcoreTest);

router
.route('/')
.get(authColler.protect, userC.getAllusers)
.post(userC.createNewuser);

router
.route('/:id')
.get(userC.findUser)
.patch(userC.updateUser)
.delete(authColler.protect, authColler.restrictTo('admin', 'lead-guide'), userC.deleteuser);

module.exports = router
