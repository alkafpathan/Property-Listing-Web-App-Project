const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { ListingSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");

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
router.get("/",wrapAsync( async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings})
}))
//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});
//create route
router.post("/",validateListing, wrapAsync( async (req,res,next)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(400 , "send valid data for listing")
        // } //insted
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}))

//edit route
router.get("/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

//update route
router.put("/:id" ,validateListing,wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`)
}));

//delete route
router.delete("/:id",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log("DELETED LISTING",deletedListing)
    res.redirect(`/listings`)
}));




//read or show route
router.get("/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    // console.log(listing)
    res.render("listings/show.ejs",{listing})

}));

module.exports = router;
