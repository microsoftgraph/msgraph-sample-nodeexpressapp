# Extend the Node.js Express app for Azure AD Authentication

In this demo you will extend the application from the previous demo to support authentication with Azure AD. This is required to obtain the necessary OAuth access token to call the Microsoft Graph. In this step you will integrate the [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad) library into the application.

Create a new file named `.env` file in the root of your application, and add the following code.

```text
OAUTH_APP_ID=YOUR_APP_ID_HERE
OAUTH_APP_PASSWORD=YOUR_APP_PASSWORD_HERE
OAUTH_REDIRECT_URI=http://localhost:8000/auth/callback
OAUTH_SCOPES='profile offline_access user.read calendars.read'
OAUTH_AUTHORITY=https://login.microsoftonline.com/common
OAUTH_ID_METADATA=/v2.0/.well-known/openid-configuration
```

Replace `YOUR APP ID HERE` with the application ID from the Application Registration Portal, and replace `YOUR APP SECRET HERE` with the password you generated.

> **Important:** If you're using source control such as git, now would be a good time to exclude the `.env` file from source control to avoid inadvertently leaking your app ID and password.

Open `./app.js` and add the following line to the top of the file to load the `.env` file.

```js
require('dotenv').config();
```

## Implement sign-in

Locate the line `var indexRouter = require('./routes/index');` in `./app.js`. Insert the following code **before** that line.

```js
var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

// Configure passport

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
var users = {};

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done (null, user.profile.oid);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

// Configure OIDC strategy
passport.use(new OIDCStrategy(
  {
    identityMetadata: process.env.OAUTH_ID_METADATA,
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    if (!profile.oid) {
      return done(new Error("No OID found in user profile."), null);
    }

    // Save the profile, accessToken, and refreshToken in
    // user storage
    users[profile.oid] = { profile, accessToken, refreshToken };
    return done(null, users[profile.oid]);
  }
));
```

This code initializes the [Passport.js](http://www.passportjs.org/) library to use the `passport-azure-ad` library, and configures it with the app ID and password for the app.

Now pass the `passport` object to the Express app. Locate the line `app.use('/', indexRouter);` in `./app.js`. Insert the following code **before** that line.

```js
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
```

Create a new file in the `./routes` directory named `auth.js` and add the following code.

```js
var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET auth callback. */
router.get('/signin',
  function  (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {
    res.redirect('/');
  }
);

router.post('/callback',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {
    // TEMPORARY!
    // Flash the access token for testing purposes
    req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
    res.redirect('/');
  }
);

router.get('/signout',
  function(req, res) {
    req.session.destroy(function(err) {
      req.logout();
      res.redirect('/');
    });
  }
);

module.exports = router;
```

This defines a router with three routes: `signin`, `callback`, and `signout`.

The `signin` route calls the `passport.authenticate` method, causing the app to redirect to the Azure login page.

The `callback` route is where Azure redirects after the signin is complete. The code calls the `passport.authenticate` method again, causing the `passport-azure-ad` strategy to request an access token. Once the token is obtained, the next handler is called, which redirects back to the home page with the access token in the temporary error value. We'll use this to verify that our sign-in is working before moving on. Before we test, we need to configure the Express app to use the new router from `./routes/auth.js`.

Insert the following code **before** the `var app = express();` line.

```js
var authRouter = require('./routes/auth');
```

Then insert the following code **after** the `app.use('/', indexRouter);` line.

```js
app.use('/auth', authRouter);
```

Start the server and browse to `https://localhost:3000`. Click the sign-in button and you should be redirected to `https://login.microsoftonline.com`. Login with your Microsoft account and consent to the requested permissions. The browser redirects to the app, showing the token.

