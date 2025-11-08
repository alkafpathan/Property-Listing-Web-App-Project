const User = require("../models/user.js");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}


module.exports.signUp = async (req,res)=>{    
    try{
        let {username , email ,password} = req.body;
        const newUser = await new User({
            email, username
        });
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err); 
            }
            req.flash("success","User was registered , Welcome to EasyList.");
            res.redirect("/listings");
        })
        
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}


module.exports.renderLogInForm = (req,res)=>{
    
    res.render("users/login.ejs")
}


module.exports.sucessLogIn = async (req,res)=>{    
    req.flash("success","Welcome to Wonderlust ! You are logged in ...");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return    next(err);
        }
        req.flash("success","you are log out now" )
        res.redirect("/listings")
    })  
}