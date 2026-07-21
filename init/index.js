const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

// Real user _id to assign as owner to any listing with an invalid/missing owner
const REAL_OWNER_ID = "6a5fd29ef3309094865b4562";

const fixOwners = async () => {
    // Update ALL listings to use this owner
    const result = await Listing.updateMany(
        {},
        { $set: { owner: REAL_OWNER_ID } }
    );

    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
};

mongoose.connect(process.env.ATLASDB_URL) // use whichever var name your .env actually has
    .then(() => {
        console.log("MongoDB connected");
        return fixOwners();
    })
    .catch((err) => {
        console.log("Error:", err);
    })
    .finally(() => {
        mongoose.connection.close();
    });