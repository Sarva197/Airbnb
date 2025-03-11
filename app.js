if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
 // Override with query string or header
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { console } = require("inspector");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const dburl = process.env.ATLASDBURL;

main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
});

async function main () {
    await mongoose.connect(dburl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json()); 
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

const sessionOptions = {
    store:store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        //days //hours //minutes //sec //millisec
        expires : Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge :  3 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

//passport is used for authentication , its a library , pbkdf2 hashing algorithm is used in passport
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStratergy(User.authenticate()));//Generates a function that is used in Passport's LocalStrategy



passport.serializeUser(User.serializeUser());//Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());//Generates a function that is used by Passport to deserialize users into the



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/user",usersRouter);
app.use("/user",usersRouter);
app.use("/search",searchRouter);
app.use("/",homeport);




//error handling with error handling middleware

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"page Not found"));
});//this is to handle if use sends request to invalied api which dosent exist so we 
//give page not found error

app.use((err,req,res,next)=>{
    let {status = 500 , message = "something went wrong"} = err;
    res.status(status).render("error.ejs",{err});
});


app.listen(3000,()=>{
    console.log("server is on");
})