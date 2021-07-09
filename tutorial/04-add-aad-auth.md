<!-- markdownlint-disable MD002 MD041 -->

In this exercise you will extend the application from the previous exercise to support authentication with Azure AD. This is required to obtain the necessary OAuth access token to call the Microsoft Graph. In this step you will integrate the [msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) library into the application.

1. Create a new file named **.env** in the root of your application, and add the following code.

    :::code language="ini" source="../demo/graph-tutorial/example.env":::

    Replace `YOUR_CLIENT_ID_HERE` with the application ID from the Application Registration Portal, and replace `YOUR_CLIENT_SECRET_HERE` with the client secret you generated.

    > [!IMPORTANT]
    > If you're using source control such as git, now would be a good time to exclude the **.env** file from source control to avoid inadvertently leaking your app ID and password.

1. Open **./app.js** and add the following line to the top of the file to load the **.env** file.

    ```javascript
    require('dotenv').config();
    ```

## Implement sign-in

1. Locate the line `var app = express();` in **./app.js**. Insert the following code **after** that line.

    :::code language="javascript" source="../demo/graph-tutorial/app.js" id="MsalInitSnippet":::

    This code initializes the msal-node library with the app ID and password for the app.

1. Create a new file in the **./routes** directory named **auth.js** and add the following code.

    ```javascript
    const router = require('express-promise-router')();

    /* GET auth callback. */
    router.get('/signin',
      async function (req, res) {
        const urlParameters = {
          scopes: process.env.OAUTH_SCOPES.split(','),
          redirectUri: process.env.OAUTH_REDIRECT_URI
        };

        try {
          const authUrl = await req.app.locals
            .msalClient.getAuthCodeUrl(urlParameters);
          res.redirect(authUrl);
        }
        catch (error) {
          console.log(`Error: ${error}`);
          req.flash('error_msg', {
            message: 'Error getting auth URL',
            debug: JSON.stringify(error, Object.getOwnPropertyNames(error))
          });
          res.redirect('/');
        }
      }
    );

    router.get('/callback',
      async function(req, res) {
        const tokenRequest = {
          code: req.query.code,
          scopes: process.env.OAUTH_SCOPES.split(','),
          redirectUri: process.env.OAUTH_REDIRECT_URI
        };

        try {
          const response = await req.app.locals
            .msalClient.acquireTokenByCode(tokenRequest);

          // TEMPORARY!
          // Flash the access token for testing purposes
          req.flash('error_msg', {
            message: 'Access token',
            debug: response.accessToken
          });
        } catch (error) {
          req.flash('error_msg', {
            message: 'Error completing authentication',
            debug: JSON.stringify(error, Object.getOwnPropertyNames(error))
          });
        }

        res.redirect('/');
      }
    );

    router.get('/signout',
      async function(req, res) {
        // Sign out
        if (req.session.userId) {
          // Look up the user's account in the cache
          const accounts = await req.app.locals.msalClient
            .getTokenCache()
            .getAllAccounts();

          const userAccount = accounts.find(a => a.homeAccountId === req.session.userId);

          // Remove the account
          if (userAccount) {
            req.app.locals.msalClient
              .getTokenCache()
              .removeAccount(userAccount);
          }
        }

        // Destroy the user's session
        req.session.destroy(function (err) {
          res.redirect('/');
        });
      }
    );

    module.exports = router;
    ```

    This defines a router with three routes: `signin`, `callback`, and `signout`.

    The `signin` route calls the `getAuthCodeUrl` function to generate the login URL, then redirects the browser to that URL.

    The `callback` route is where Azure redirects after the signin is complete. The code calls the `acquireTokenByCode` function to exchange the authorization code for an access token. Once the token is obtained, it redirects back to the home page with the access token in the temporary error value. We'll use this to verify that our sign-in is working before moving on. Before we test, we need to configure the Express app to use the new router from **./routes/auth.js**.

    The `signout` method logs the user out and destroys the session.

1. Open **./app.js** and insert the following code **before** the `var app = express();` line.

    ```javascript
    const authRouter = require('./routes/auth');
    ```

1. Insert the following code **after** the `app.use('/', indexRouter);` line.

    ```javascript
    app.use('/auth', authRouter);
    ```

Start the server and browse to `https://localhost:3000`. Click the sign-in button and you should be redirected to `https://login.microsoftonline.com`. Login with your Microsoft account and consent to the requested permissions. The browser redirects to the app, showing the token.

### Get user details

1. Create a new file in the root of the project named **graph.js** and add the following code.

    ```javascript
    var graph = require('@microsoft/microsoft-graph-client');
    require('isomorphic-fetch');

    module.exports = {
      getUserDetails: async function(msalClient, userId) {
        const client = getAuthenticatedClient(msalClient, userId);

        const user = await client
          .api('/me')
          .select('displayName,mail,mailboxSettings,userPrincipalName')
          .get();
        return user;
      },
    };

    function getAuthenticatedClient(msalClient, userId) {
      if (!msalClient || !userId) {
        throw new Error(
          `Invalid MSAL state. Client: ${msalClient ? 'present' : 'missing'}, User ID: ${userId ? 'present' : 'missing'}`);
      }

      // Initialize Graph client
      const client = graph.Client.init({
        // Implement an auth provider that gets a token
        // from the app's MSAL instance
        authProvider: async (done) => {
          try {
            // Get the user's account
            const account = await msalClient
              .getTokenCache()
              .getAccountByHomeId(userId);

            if (account) {
              // Attempt to get the token silently
              // This method uses the token cache and
              // refreshes expired tokens as needed
              const response = await msalClient.acquireTokenSilent({
                scopes: process.env.OAUTH_SCOPES.split(','),
                redirectUri: process.env.OAUTH_REDIRECT_URI,
                account: account
              });

              // First param to callback is the error,
              // Set to null in success case
              done(null, response.accessToken);
            }
          } catch (err) {
            console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
            done(err, null);
          }
        }
      });

      return client;
    }
    ```

    This exports the `getUserDetails` function, which uses the Microsoft Graph SDK to call the `/me` endpoint and return the result.

1. Open **./routes/auth.js** and add the following `require` statements to the top of the file.

    ```javascript
    const graph = require('../graph');
    ```

1. Replace the existing callback route with the following code.

    :::code language="javascript" source="../demo/graph-tutorial/routes/auth.js" id="CallbackSnippet" highlight="13-26":::

    The new code saves the user's account ID in the session, gets the user's details from Microsoft Graph, and saves it in the app's user storage.

1. Restart the server and go through the sign-in process. You should end up back on the home page, but the UI should change to indicate that you are signed-in.

    ![A screenshot of the home page after signing in](./images/add-aad-auth-01.png)

1. Click the user avatar in the top right corner to access the **Sign Out** link. Clicking **Sign Out** resets the session and returns you to the home page.

    ![A screenshot of the dropdown menu with the Sign Out link](./images/add-aad-auth-02.png)

## Storing and refreshing tokens

At this point your application has an access token, which is sent in the `Authorization` header of API calls. This is the token that allows the app to access the Microsoft Graph on the user's behalf.

However, this token is short-lived. The token expires an hour after it is issued. This is where the refresh token becomes useful. The OAuth specification introduces a refresh token, which allows the app to request a new access token without requiring the user to sign in again.

Because the app is using the msal-node package, you do not need to implement any token storage or refresh logic. The app uses the default msal-node in-memory token cache, which is sufficient for a sample application. Production applications should provide their own [caching plugin](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md) to serialize the token cache in a secure, reliable storage medium.
