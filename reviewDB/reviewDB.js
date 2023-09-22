
const { kStringMaxLength } = require('buffer');
const { error } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const db_key = process.env.MONGODB_URI;
require('dotenv').config();

function connectMongoose1() {
    mongoose.connect(db_key, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const reviewsSchema = new mongoose.Schema({
    title: String,
    imageurl: String,
    content: String,
    album: String,
    writer: String,
    date: String,
    artist: String
});

const Review = mongoose.model('Review', reviewsSchema);

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...`; // Your Lorem Ipsum text

async function addReviewIfNotExists(reviewData) {
    const existingReview = await Review.findOne({ title: reviewData.title });

    if (!existingReview) {
        const review = new Review(reviewData);
        await review.save();
        console.log(`Review '${reviewData.title}' added to the database.`);
    } else {
        console.log(`Review '${reviewData.title}' already exists in the database. Skipped.`);
    }
}
// Add reviews if they don't exist
// addReviewIfNotExists({
//     title: 'illmatic',
//     content: loremIpsum,
//     album: 'illmatic',
//     imageurl: "https://wallpaperaccess.com/full/544405.jpg"
// });

// addReviewIfNotExists({
//     title: 'folklore',
//     content: 'sample',
//     album: 'folklore',
//     imageurl: "https://static01.nyt.com/images/2020/07/29/arts/26TAYLOR-REVIEW2/merlin_174906645_18f50351-935e-4249-93a9-9a463e9f0dd5-superJumbo.jpg"
// });

// addReviewIfNotExists({
//     title: "rang de basanti",
//     content: "If there are two things AR Rahman is known for, ...",
//     album: "rang de basanti",
//     imageurl: "https://e1.pxfuel.com/desktop-wallpaper/866/562/desktop-wallpaper-rang-de-basanti-rang-de-thumbnail.jpg"
// });

// // Add new reviews while ignoring existing ones
// addReviewIfNotExists({
//     title: 'new_review_1',
//     content: 'New review content 1',
//     album: 'New album 1',
//     imageurl: 'URL for new image 1'
// });

// addReviewIfNotExists({
//     title: 'new_review_2',
//     content: 'New review content 2',
//     album: 'New album 2',
//     imageurl: 'URL for new image 2'
// });

// addReviewIfNotExists({
//     title: 'new_review_3',
//     content: 'New review content 3',
//     album: 'New album 3',
//     imageurl: 'URL for new image 3'
// });


module.exports = { connectMongoose1, Review };
