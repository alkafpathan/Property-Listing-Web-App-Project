const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")


const listings = require("./routes/listing");
const reviews = require("./routes/review");

//seting view engine as ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

//to use req.params
app.use(express.urlencoded({extended :true}));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsMate)

//creating connection with DB
main().then(()=>{{
    console.log('connected to db');
}}).catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect(MONGO_URL);
}

//basic root api
app.get("/",(req,res)=>{
    res.send("hi i am root");
})



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



//for req which does not match any route handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


//handling error using middleware
app.use((err,req,res,next)=>{
    let { statusCode= 500 , message= "something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" ,{message})
})

app.listen(port ,(req,res)=>{
    console.log('listning on port : ', port);
});