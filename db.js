const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require('dotenv').config();

exports.connectMongoose = () => {
    const db_key = process.env.MONGODB_URI;
    mongoose.connect(db_key).then(e => console.log('connected to mongodb'))
        .catch((e) => console.log(e));
};
const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


const reviewsSchema = new mongoose.Schema({
    name: String,
    title: String,
    date: String
})
exports.User = mongoose.model("User", userSchema);
