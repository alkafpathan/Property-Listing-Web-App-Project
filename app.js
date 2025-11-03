const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { ListingSchema} = require("./schema.js")


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


//validating listing using Joi (with the of a validate listing middleware function)
const validateListing = (req, res , next )=>{
    let {error} = ListingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join();
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//index route or listing route
app.get("/listings",wrapAsync( async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings})
}))
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});
//create route
app.post("/listings",validateListing, wrapAsync( async (req,res,next)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(400 , "send valid data for listing")
        // } //insted
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}))

//edit route
app.get("/listings/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

//update route
app.put("/listings/:id" ,validateListing,wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`)
}));

//delete route
app.delete("/listings/:id",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log("DELETED LISTING",deletedListing)
    res.redirect(`/listings`)
}));


//read or show route
app.get("/listings/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing)
    res.render("listings/show.ejs",{listing})

}))

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