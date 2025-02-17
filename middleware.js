module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //to store the url the user is requesting
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/user/login");
    }
    next();
}

//by default , passport resets the session after login , so we need to store redirectUrl in res.locals and passport can not access it , 
//therefore we need the below middleware to store the redirectUrl

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}