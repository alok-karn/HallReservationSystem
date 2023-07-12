const express = require("express");
const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const dotenv = require("dotenv").config();
const session = require("express-session");
const axios = require("axios");
const firebaseAdmin = require("firebase-admin");
const flash = require("connect-flash");

const app = express();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "hallmangement.firebaseapp.com",
    projectId: "hallmangement",
    storageBucket: "hallmangement.appspot.com",
    messagingSenderId: "288779564454",
    appId: process.env.FIREBASE_APP_ID,
};

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    databaseURL: firebaseConfig.databaseURL,
});

const CALLBACK_URL = "http://localhost:3000/auth/microsoft/callback";

app.use(
    session({
        secret: "this is my secret key for my web app",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: false,
        },
    })
);

passport.use(
    new MicrosoftStrategy(
        {
            clientID: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET_VALUE,
            callbackURL: CALLBACK_URL,
            scope: ["profile", "email"],
            // passReqToCallback: true,
        },
        // async (accessToken, refreshToken, profile, done) => {
        //     try {
        //         if (refreshToken) {
        //             const refreshTokenParams = {
        //                 client_id: process.env.MICROSOFT_CLIENT_ID,
        //                 client_secret:
        //                     process.env.MICROSOFT_CLIENT_SECRET_VALUE,
        //                 grant_type: "refresh_token",
        //                 refresh_token: refreshToken,
        //                 redirect_uri: CALLBACK_URL,
        //             };

        //             const response = await axios.post(
        //                 "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        //                 null,
        //                 {
        //                     params: refreshTokenParams,
        //                 }
        //             );

        //             accessToken = response.data.access_token;
        //             if (response.data.refresh_token) {
        //                 refreshToken = response.data.refresh_token;
        //             }
        //         }
        //         return done(null, profile.emails[0].value);
        //     } catch (error) {
        //         console.log(error);
        //         // return done(error);
        //     }
        // }
        (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            done(null, profile.emails[0].value);
        }
    )
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(flash());
app.set("view engine", "ejs");

// app.get("/auth/microsoft", passport.authenticate("microsoft"));

// app.get(
//     "/auth/microsoft/callback",
//     passport.authenticate("microsoft", {
//         failureRedirect: "/login",
//     }),
//     (req, res) => {
//         res.redirect("/profile");
//     }
// );

// app.get("/profile", (req, res) => {
//     const { profile, accessToken, refreshToken } = req.user;
//     res.send(`<h1>Hello! Welcome to the page.</h1>
//     <a href="/logout">Logout</a>
//     `);
// });

// app.get("/logout", (req, res) => {
// req.logout();
//     req.session.destroy((err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             req.user = null;
//             res.clearCookie("connect.sid");
//             res.redirect("/auth/microsoft");
//         }
//     });

//     // res.redirect("/auth/microsoft");
// });

app.get("/", (req, res) => {
    res.render("login", {
        message: req.flash("error"),
    });
});

app.get(
    "/auth/microsoft",
    passport.authenticate("microsoft", {
        scope: ["User.Read", "profile", "openid", "email"],
    })
);

app.get(
    "/auth/microsoft/callback",
    passport.authenticate("microsoft", {
        successRedirect: "/home",
        failureRedirect: "/",
        failureFlash: true,
    })
);

app.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        console.log(user);
        res.render("home", { user });
    } else {
        res.render("/");
    }
});

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return;
            }
            res.clearCookie("connect.sid");
            res.redirect("/");
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000 ....");
});
