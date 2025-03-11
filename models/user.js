const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;


const userSchema = Schema({
    email :{
        type : String,
        required : true
    },
    resetOTP: {
        type: String, // Store OTP
    },
    otpExpiry: {
        type: Date, // Store expiry time
    }
});

userSchema.plugin(passportLocalMongoose,{limitAttempts: true, maxAttempts: 2, unlockInterval: 20000});

module.exports = mongoose.model('User', userSchema);