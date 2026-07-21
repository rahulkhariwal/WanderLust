const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;



const listingSchema = new Schema({
    title:{
        type : String,
        required: true,
    },
    description:String,
    image:{
        filename : String,
        url :{
         type: String,
         default : "https://unsplash.com/photos/a-pagoda-in-silhouette-against-a-sunset-sky-YFu500rKvsM",
         set: (v) => (v) === "" ? "https://unsplash.com/photos/a-pagoda-in-silhouette-against-a-sunset-sky-YFu500rKvsM" : v,
        }
    },
    price:Number,
    location: String,
    country:String,

  owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },

    reviews :[
    {
        type : Schema.Types.ObjectId,
        ref: "Review",
    }
]
});



 listingSchema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}})
    }
 })

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing ;