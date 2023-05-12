// require mongoose:
const { Schema, model } = require("mongoose");

// create schema:
const userSchema = new Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: String,
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user"
    },
    favoriteCharacter: {
        type: Schema.Types.ObjectId,
        ref: "Character"
    }
})

// create model:
const User = model("User", userSchema);

// export the model:
module.exports = User;