const mongoose = require("mongoose");
//creating Schema varieable so i dont user mongoose.Schema
const Schema = mongoose.Schema;

//creating Schema for listing
const reviewSchema = new Schema({
    comment : {
        type : String ,
        required : true
    },
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    cratedAt : {
        type : Date,
        default: Date.now()
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",  
    }
});

module.exports = mongoose.model("Review",reviewSchema)