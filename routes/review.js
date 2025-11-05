const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {  reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//validating reviews using Joi (with the of a validate listing middleware function)
const validateReview = (req, res , next )=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join();
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//Reviews
//post review route
router.post("/", validateReview, wrapAsync( async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // console.log(listing);
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${req.params.id}`)

}));

//delete review route
router.delete("/:reviewId",wrapAsync(
    async (req,res)=>{
        let {id , reviewId} = req.params;
        
        await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${req.params.id}`)
    }
))

 
module.exports = router;