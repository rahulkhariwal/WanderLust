require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");


const listingRoute = require("./routes/listing.js");
const reviewRoute= require("./routes/review.js");
const userRoute = require("./routes/user.js");



const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); 
app.engine('ejs', ejsMate); 
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.get("/" , (req, res) =>{
    res.send("route is working");
})

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser" , async(req ,res) =>{
    let fakeUser = new User({
        email:"rahul@gmail.com",
        username :"rahul_khariwal"
    })

    let registerUser = await User.register(fakeUser, "helloworld");
    res.send(registerUser)
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews" , reviewRoute);
app.use("/", userRoute )

//All Listing

// app.get("/sampleListing" , async( req , res) =>{
//     const sampleListing = new Listings({
//         title: "villa",
//         discription : "peace full place",
//         price : 1200,
//         location: " katmandu Nepal",
//         country : "Nepal",
//     })
//     await sampleListing.save();
//     console.log("smaple is save");
//     res.send("successful");
// })

app.all("*path", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render("error.ejs", {
        err
    });
});

mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("MongoDB connected");
})
.catch((err) =>{
    console.log(err);
})


app.listen(port , () => {
    console.log("Server is running on post 8080");
})

