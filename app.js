//import necessary modules
const express = require('express');
const port = 3000;
const app = express();
const { connectMongoose, User } = require("./db.js");
const passport = require("passport");
const { initializepassport, isAuthenicated } = require("./passportconfig.js")
const ejs = require("ejs");
const expressSession = require("express-session");
const { connectMongoose1, Review } = require("./reviewDB/reviewDB.js");
const internal = require('stream');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();



function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));


connectMongoose();


initializepassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: "secret", resave: false, saveUninitialized: false, cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.render("mainlanding.ejs");
})

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/loginsass", (req, res) => {
    res.render("loginsass.ejs");
});


app.post("/signup", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (user) return res.status(400).send("Username already exists!");

    const newuser = await User.create(req.body);

    res.redirect("/loginsass");
})
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})
// app.post("/loginsass", passport.authenticate("local", {
//     successRedirect: "/testdashboard",
//     failureRedirect: "/loginsass"
// }));

app.post("/loginsass", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/loginsass");
        }
        const sessionExpiration = req.body['remember-me'] ? 30 * 24 * 60 * 60 * 1000 : null; // 30 days in milliseconds
        req.session.cookie.maxAge = sessionExpiration;

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/testdashboard");
        });
    })(req, res, next);
});


app.get("/profile", isAuthenicated, (req, res, next) => {
    res.send(req.user);
});

app.get('/testdashboard', async (req, res) => {
    try {
        const reviews = await Review.find();
        console.log('USer:', req.user);
        res.render('trial.ejs', { reviews, user: req.user }); // Pass the reviews data to your EJS template
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.send("logged 0ut");
    });
});
app.listen(port, () => {
    console.log("Server is running on port ${port};");

});

app.get('/review', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.render('C:/Users/Dell/OneDrive/Desktop/writing_blog_project/views/review.ejs', { reviews }); // Render the reviews.ejs template with reviews data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/review/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).send('Review not found');
        }

        res.render('reviewdetails.ejs', { review }); // Render the 'review.ejs' template with review data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password.ejs');
})
app.post("/forgot-password", async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({
            username
        });
        if (!user) {
            return res.status(404).send('user not found!');
        }
        const token = generateToken();
        const expirationDate = Date.now() + 3600000;

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expirationDate;

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vinylvue@gmail.com',
                pass: 'vinylvue@vinylvue.com'

            },
        });

        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
        const mailOptions = {
            to: user.username,
            from: 'your-email-address',
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) have requested to reset your password.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetLink}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Failed to send password reset email');
            }
            res.send('Password reset email sent');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


app.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        res.render('reset-password.ejs', { token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
app.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send('Password reset successful. You can now log in with your new password.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


module.exports = app;

