const mongoose = require("mongoose");
//creating Schema varieable so i dont user mongoose.Schema
const Schema = mongoose.Schema;

//creating Schema for listing
const listingSchema = new Schema({
    title : {
        type : String ,
        required : true
    },
    description : String,
    url : {
        type : String,
        default : "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" ,
         set : (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" : v,
    },
    price : Number,
    location : String,
    country : String,
});

//creating model with lisingSchema
const Listing = mongoose.model("Listing",listingSchema);
//exproting the model
module.exports = Listing;
