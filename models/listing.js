const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image :{
        url : String,
        filename : String,
    },
    price : Number,
    location : String,
    country : String,
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
