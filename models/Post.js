const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is Required']
    },
    title: {
        type: String,
        required: [true, 'Title is Required']
    },
    content: {
        type: String,
        required: [true, 'Content is Required']
    },
    author: {
        type: String,
        required: [true, 'Author is Required']
    },
    comments: [
        {
            userId: {
                type: String,
                required: [true, 'User ID is Required']
            },
            comment: {
                type: String,
                required: [true, 'Comment is Required']
            }
        }
    ]
});

module.exports = mongoose.model('Post', postSchema);