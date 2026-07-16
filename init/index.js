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

const initDB = async () => {
    await Listing.deleteMany({});

    const allListings = initData.data.map((obj) => ({
        ...obj,
        owner: "6a55f0258b7b6ea5c9becc62",
    }));

    await Listing.insertMany(allListings);

    console.log("Data is initialized");
};
initDB();
