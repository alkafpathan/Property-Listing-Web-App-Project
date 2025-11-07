const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const User = require("../models/user.js");
const passport = require("passport")
const {saveRedirectUrl }= require("../middleware")

const userController = require("../controllers/users.js");


router.route("/signup")
 .get(userController.renderSignUpForm )
 .post(wrapAsync( userController.signUp ));


router.route("/login")
    .get(userController.renderLogInForm)
    .post( 
        saveRedirectUrl ,
        passport.authenticate("local",{
       failureRedirect : "/login" ,
       failureFlash : true }),
         userController.sucessLogIn
     );

router.get("/logout", userController.logOut);

module.exports = router;