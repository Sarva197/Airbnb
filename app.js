const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
 // Override with query string or header
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { console } = require("inspector");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");

main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
});

async function main () {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


//error handling with error handling middleware

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"page Not found"));
});//this is to handle if use sends request to invalied api which dosent exist so we 
//give page not found error

app.use((err,req,res,next)=>{
    let {status = 500 , message = "something went wrong"} = err;
    res.status(status).render("error.ejs",{err});
});


app.listen(4000,()=>{
    console.log("server is on");
});