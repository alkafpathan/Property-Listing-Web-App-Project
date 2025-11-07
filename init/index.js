const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//creating connection with DB
main().then(()=>{{
    console.log('connected to db');
}}).catch((err)=>{
    console.log(err); 
})
async function main(){
    mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
   await Listing.deleteMany({}); 
   //adding owner property to the initial data
   initData.data = initData.data.map((obj) => ( { ...obj , owner : "690c9ff54b97cbe5da972979"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDB();