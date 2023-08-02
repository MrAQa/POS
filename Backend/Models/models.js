// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    Items: [
        {
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            type: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
        }
    ],
    totalAmount: { type: Number, required: true },
    date: { type: String },
    createdAt: { type: Date }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
