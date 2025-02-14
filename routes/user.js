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
    let registerUser = await User.register(newUser , password);// here register hashes the password and saves user into database , thats why we dont need to separatelly save user into db, its a middleware (passport-local-mongoose)
    req.flash("success", `Welcome ${username}`);
    res.redirect("/listings");
   } catch (error) {
    req.flash("error", error.message)
    res.redirect("/signup");
   }
}));

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs")
});

// router.post("/login",passport.authenticate("local",{failureRedirect: '/login' , failureFlash : true }),
// async(req,res)=>{
//     let {username} = req.body;
//     req.flash("success", `Welcome to WanderLust ${username}`);
//     res.redirect("/listings");
// });

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err); // Handle internal server errors
  
      if (!user) {
        if (info.name === "IncorrectPasswordError") {
          req.flash("error", "Oops! The password you entered is incorrect.");
        } else if (info.name === "IncorrectUsernameError") {
          req.flash("error", "No account found with that username.");
        } else {
          req.flash("error", info.message); // Other errors //
        }
        return res.redirect("/user/login");
      }
  
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome to WanderLust, ${user.username}!`);
        return res.redirect("/listings");
      });
    })(req, res, next);
  });

  router.get("/forgetPassword", (req,res)=>{
    res.render("./users/changepassword.ejs")
  });

  router.post("/forgetPassword", wrapAsync (async (req,res)=>{
    try {
    let {username , oldPassword , newPassword} = req.body;
    const user = await User.findByUsername(username);
    console.log(username)
    console.log(user);

    if(!user){
      req.flash("error", "user not found");
      return res.redirect("/user/forgetPassword");
    }

    user.changePassword(oldPassword, newPassword, async (err) => {
      if (err) {
          req.flash("error", "Old password is incorrect or new password is invalid");
          return res.redirect("/user/forgetPassword");
      }

      await user.save();//this wont save new objects 
      req.flash("success", "Password changed successfully");
      return res.redirect("/user/login");
  });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/users/forgetPassword");
    }
  }));
  

module.exports = router;