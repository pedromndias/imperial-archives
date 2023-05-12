const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    character: {
        type: Schema.Types.ObjectId,
        ref: "Character"
    }
})

const Comment = model("Comment", commentSchema);

module.exports = Comment;