const express = require("express");
const msal = require("@azure/msal-node");
const session = require("express-session");
const dotenv = require("dotenv").config();
const crypto = require("crypto");

const SERVER_PORT = process.env.PORT || 3000;

// setup express app

const app = express();
app.use(
    express.urlencoded({
        extended: true,
    })
);

// MSAL config

const config = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: process.env.AUTHORITY,
        clientSecret: process.env.CLIENT_SECRET,
        authorizationCodePkce: true,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        },
    },
};

// Create msal application object

const pca = new msal.ConfidentialClientApplication(config);

// Create express session middleware

app.use(
    session({
        secret: "The quick brown fox jumps over the lazy dog",
        resave: false,
        saveUninitialized: false,
    })
);

// Set up route for redirect

app.get("/", (req, res) => {
    res.send(`
    <h1>Login with Microsoft Account</h1>
    <form method="post" action="/login">
      <button type="submit">Login with Microsoft</button>
    </form>
    `);
});

app.post("/login", (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["openid", "profile", "User.read"],
        redirectUri: "http://localhost:3000/redirect",
        // codeChallenge: crypto
        //     .createHash("sha256")
        //     .update(crypto.randomBytes(32))
        //     .digest("base64"), // generate code challenge
        codeChallenge: "",
        codeChallengeMethod: "S256", // use sha256 for code challenge method
    };

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return;
        }

        const codeVerifier = buffer
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const codeChallenge = crypto
            .createHash("sha256")
            .update(codeVerifier)
            .digest("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        authCodeUrlParameters.codeChallenge = codeChallenge;
        pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
            res.redirect(response);
        });
    });
});

app.get("/redirect", (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["openid", "profile", "User.read"],
        redirectUri: "http://localhost:3000/redirect",
        codeVerifier: req.session.codeVerifier, // generate code verifier
    };

    pca.acquireTokenByCode(tokenRequest)
        .then((response) => {
            req.session.user = response.account;
            req.session.save(() => {
                res.redirect("/home");
            });
        })
        .catch((error) => {
            console.log(error);
            res.send(
                `<script>alert('Failed to login. Please try again.'); window.location.href='/'</script>`
            );
        });
});

app.get("/home", (req, res) => {
    if (req.session.user) {
        res.send(
            `<h1>Hello ${req.session.user.username}! Welcome to the page.</h1>`
        );
    } else {
        res.redirect("/");
    }
});

// start the server

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
