if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/easylist" ;
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


const listingRouter= require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

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

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true,
    }
}

//basic root api
app.get("/",(req,res)=>{
    res.redirect("/listings")
    // res.send("hi i am root");
})

//middleware to create session
app.use(session(sessionOptions))
//middlware for flash
app.use(flash());


//Implementing Passport
app.use(passport.initialize());//to initialize passport for evey request
app.use(passport.session());// when a user is associated with series of request and responce is know as session
passport.use(new LocalStrategy(User.authenticate()));


//to serialize(store) users in session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//middleware for flash messages or defining locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next();
})


// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "alkaf-khan"
//     });
//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser)
// })



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter)


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