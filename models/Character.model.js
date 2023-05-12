const { Schema, model } = require("mongoose");

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
        enum: ["human", "droid", "rhodian"]
    },
    homeworld: {
        type: String,
        required: true,
        enum: ["tatooine", "parnassos", "jakku"]
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