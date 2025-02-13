const express = require("express");
const router =  express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs")
});

router.post("/signup", wrapAsync( async (req,res)=>{
   try {
    let {username , email , password} = req.body;
    const newUser = new User({email , username});
    let registerUser = await User.register(newUser , password);
    console.log(registerUser);
    req.flash("success", `Welcome ${username}`);
    res.redirect("/listings");
   } catch (error) {
    req.flash("error", error.message)
    res.redirect("/signup");
   }
}))

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs")
});

router.post("/login",passport.authenticate("local",{failureRedirect: '/login' , failueflash : true }),
async(req,res)=>{
    let {username} = req.body;
    req.flash("success", `Welcome to WanderLust ${username}`);
    res.redirect("/listings");
})

module.exports = router;