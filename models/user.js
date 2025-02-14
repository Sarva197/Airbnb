const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;


const userSchema = Schema({
    email :{
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose,{limitAttempts: true, maxAttempts: 2, unlockInterval: 2000});

module.exports = mongoose.model('User', userSchema);