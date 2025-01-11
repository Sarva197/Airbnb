const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
});

async function main () {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
};

const initDB = async()=>{
    //deleting every documents if exists
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);//initdb is a object and we are accessing data in it
    console.log("data was initilized");
}

initDB();