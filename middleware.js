const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const sendEmail = require("./utils/sendMail.js");
const User = require("./models/user.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //to store the url the user is requesting
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/user/login" || "/listings");
    }
    next();
};

//by default , passport resets the session after login , so we need to store redirectUrl in res.locals and passport can not access it , 
//therefore we need the below middleware to store the redirectUrl

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
         let { id } = req.params;
        let listing = await Listing.findById(id);

        // Check ownership
        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

//joi validation middleware  for listings
module.exports.validateListing = (req,res,next)=>{
    //joi server side schema validation 
    const {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error.details)
        let err = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, err);
    }else{
        next();
    }

}

module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((e)=>e.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isRevOwner = async (req,res,next)=>{
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.generateOtp = async (req,res,next)=>{
    try{
        let {email} = req.body;
        const user = await User.findOne({email : email});
        if(!user){
            req.flash("error","No account found with that email");
            return res.redirect("/user/forgetPassword");
        }
        //otp generate
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetOTP = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        //sending mail
        const subject = "Password Reset OTP";
        const message = `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`;
        await sendEmail(email, subject, message);
        req.flash("success", "OTP sent to your email");
        req.user = user;
        next();
    }catch(err){
        next(err);
    }
}