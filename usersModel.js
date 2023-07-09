const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { TokenExpiredError } = require('jsonwebtoken');
const bitcore = require('bitcore-lib');
const { Network } = require('bitcoinjs-lib/src/types');


const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name must be provided'],
        min: [10, 'name must not less than 10 carater'],
        max: [20, 'name must not above 20 carecter'],
        unique:true
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowerCase:true,
        validate:[validator.isEmail, 'Please provide a valid email' ]
    },
    password:{
        type: String,
        required:true,
        minlength:8,
        select: false
    },
    passConfirm:{
        type:String,
        requiresd: [true, 'Please confirm your password'],
        validate:{
            validator: function(el){
                return el === this.password
            },
            message: 'Pasword does not match'
        }

    },
    photo: String,
    __v:{
        select:false
    },
    passwordChangedAt: Date,
    role:{
        type:String,
        enum:['user', 'admin', 'guide', 'lead-guide']
    },
    passwordResetEpire: Date,
    passwordResetToken: String
});

usersSchema.pre('save', async function(next){
        if(!this.isModified('password'))
        return next();
        this.password = await bcrypt.hash(this.password, 12);
        this.passConfirm = undefined
        next();
})

usersSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew)

    this.passwordChangedAt = Date.now() - 1000;
    next()
})

usersSchema.methods.correctPswd =  async function(candidiatePassword, userPassword){
    return bcrypt.compare(candidiatePassword, userPassword)
}
usersSchema.methods.changePassAfter = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);

        return JWTTimeStamp < changedTimeStamp 
    }
    return false
}

usersSchema.methods.createPasswordResetToken = function() {

    resetToken = crypto.randomBytes(32).toString('hex');
    // resetToken = Math.round(Math.random()*100000)

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken}, this.passwordResetToken)
    console.log(Math.round(Math.random(2)*100000))

    this.passwordResetEpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

usersSchema.methods.GenerateBitcoinAddress = async function () {
 const privKey = bitcore.PrivateKey();
 const pbKey = bitcore.privKey.toPublicKey();
 const address = new bitcore.Address(pbKey, bitcore.Networks.mainnet)
return address.toString()
}

usersSchema.methods.createAddress = () =>  {
    const NewAddress = client.getNewAddress();
    return NewAddress
}

const User =  mongoose.model('User', usersSchema);

module.exports = User 