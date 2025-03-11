const User = require("../models/user");
const passport = require("passport");


module.exports.renderSignUp = (req,res)=>{
    res.render("./users/signup.ejs")
};

module.exports.createNewUser = async (req,res)=>{
    let {username , email , password} = req.body;
    const newUser = new User({email , username});
    let registerUser = await User.register(newUser , password);// here register hashes the password and saves user into database , thats why we dont need to separatelly save user into db, its a middleware (passport-local-mongoose)
    req.login(registerUser,(err)=>{
      if(err){
        return next(err);
      } 
      req.flash("success", `Welcome ${username}`);
      return res.redirect(req.session.redirectUrl || "/listings");
    });
}

module.exports.renderLogin = (req,res)=>{
    res.render("./users/login.ejs")
};

module.exports.LoginUser = (req, res, next) => {
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
  
      req.logIn(user, async (err) => {
        if (err) return next(err);
        await user.resetAttempts();
        req.flash("success", `Welcome to WanderLust, ${user.username}!`);
        return res.redirect(res.locals.redirectUrl || "/listings");
      });
    })(req, res, next);
};

module.exports.renderChangePassword =  (req,res)=>{
    res.render("./users/changePassword.ejs");
};

module.exports.changePassword = async (req,res)=>{
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
  };

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
    });
  //   req.session.destroy(() => {
  //     res.redirect("/login");
  // });
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  }

  module.exports.renderResetPassword = (req,res)=>{
    res.render("./users/resetPassword.ejs");
  }

  module.exports.resetPassword = async (req,res)=>{
    res.send("reset password route");
  }
