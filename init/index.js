const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("MongoDB connected");
})
.catch((err) =>{
    console.log(err);
})

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data is initialied");
}

initDB();
