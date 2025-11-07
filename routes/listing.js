const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { ListingSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js")
const {validateReview} = require("../middleware.js")

const listingController = require("../controllers/listings.js")



router.route("/")
    .get(wrapAsync( listingController.index ))//index route or listing route
    .post( //create route
        isLoggedIn,
        validateListing, 
        wrapAsync( listingController.createListing)
    );


//new route
router.get("/new", isLoggedIn , listingController.renderNewForm);


router.route("/:id")
    .get( wrapAsync( listingController.showListing ))//read or show route
    .delete( isLoggedIn , isOwner ,wrapAsync( listingController.destroyListing))//delete route
    .put( isLoggedIn , isOwner ,validateListing,wrapAsync( listingController.updateListing));//update route
    

// edit route
router.get("/:id/edit", isLoggedIn , isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
