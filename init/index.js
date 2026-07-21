const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN,
});

const updateMissingGeometry = async () => {
    // Find listings where geometry is missing OR geometry.type is missing
    const listingsToFix = await Listing.find({
        $or: [
            { geometry: { $exists: false } },
            { "geometry.type": { $exists: false } },
        ],
    });

    console.log(`Found ${listingsToFix.length} listings missing geometry.`);

    let updatedCount = 0;
    let failedCount = 0;

    for (let listing of listingsToFix) {
        try {
            const response = await geocodingClient
                .forwardGeocode({
                    query: `${listing.location}, ${listing.country}`,
                    limit: 1,
                })
                .send();

            if (!response.body.features.length) {
                console.log(`No geocoding result for: ${listing.location}, ${listing.country} — skipping (id: ${listing._id})`);
                failedCount++;
                continue;
            }

            listing.geometry = response.body.features[0].geometry;
            await listing.save();

            console.log(`Updated: ${listing.title} (${listing.location}, ${listing.country})`);
            updatedCount++;
        } catch (err) {
            console.log(`Error updating listing ${listing._id} (${listing.title}):`, err.message);
            failedCount++;
        }
    }

    console.log(`\nDone. Updated: ${updatedCount}, Failed/Skipped: ${failedCount}`);
};

mongoose.connect(process.env.ATLASDB_URL) // change to MONGO_URI if that's your actual env var name
    .then(() => {
        console.log("MongoDB connected");
        return updateMissingGeometry();
    })
    .catch((err) => {
        console.log("Error:", err);
    })
    .finally(() => {
        mongoose.connection.close();
    });