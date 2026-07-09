require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require('express-flash');


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



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

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);

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

