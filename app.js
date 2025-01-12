const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
 // Override with query string or header
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

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
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
});

// app.get("/test", async (req,res)=>{
//     let sample = new Listing({
//         title : "My new villa",
//         description : "by the beach",
//         price : 1200,
//         location : "Manglore , karnataka",
//         country : "India"
//     })

//     await sample.save();
//     console.log("saved");
//     res.send("sucessfull");
// })

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
}));

app.get("/listings/new",(req,res)=>{
    res.render("listings/new")
});
//if we write /listings/new below /listings/:id we get error because /new will be treated as an :id therefore we've writtent it above
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing})
}));

//create route
app.post("/listings", wrapAsync(async (req,res,next)=>{
    //since we have made the key value pair in new.ejs name sec now we can access it like this 
    //here we are saving the input data by crating a new instance of Listing model and then we are saving that into our database
    
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
})
);

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError (400 ,"send valid data");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listings});//destructuring using spread operator
    res.redirect("/listings");
})
);

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//error handling

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"page Not found"));
});//this is to handle if use sends request to invalied api which dosent exist so we 
//give page not found error

app.use((err,req,res,next)=>{
    let {status = 500 , message = "something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
});



app.listen(4000,()=>{
    console.log("server is on");
});