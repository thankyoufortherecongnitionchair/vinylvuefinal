const { doesNotMatch } = require('assert');
const { User } = require('./db.js');
const localstrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

exports.initializepassport = (passport) => {
    passport.use(
        new localstrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username });

                if (!user) return done(null, false);
                const ismatch = await bcrypt.compare(password, user.password);
                // if (user.password !== password) return done(null, false);
                if (ismatch) {
                    return done(null, user);
                }
                return done(null, false, { message: "invalid password" });
            } catch (error) {
                return done(error);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });
};


exports.isAuthenicated = (req, res, next) => {
    if (req.user)
        return next();

    res.redirect("/login");
}