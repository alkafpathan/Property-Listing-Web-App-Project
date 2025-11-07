const mongoose = require("mongoose");
//creating Schema varieable so i dont user mongoose.Schema
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema= new Schema({
    email : {
        type : String,
        required : true
    },
})

//i have use passportLocalMongoose as a user plugin so it will automatically implement  the username hashpassword hashing and salting
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);