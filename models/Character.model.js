const { Schema, model } = require("mongoose");

// Import our arrays in json files so that we make it the only values for the species and homeworlds (enum):
let speciesArray = require("../utils/species.json"); 
let homeworldArray = require("../utils/homeworld.json")

const characterSchema = new Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    species: {
        type: String,
        required: true,
        enum: speciesArray
    },
    homeworld: {
        type: String,
        required: true,
        enum: homeworldArray
    },
    age: Number,
    image: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Character = model("Character", characterSchema);

module.exports = Character;