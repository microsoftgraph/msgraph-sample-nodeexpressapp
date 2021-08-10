<!-- markdownlint-disable MD002 MD041 -->

In this exercise you will use [Express](http://expressjs.com/) to build a web app.

1. Open your CLI, navigate to a directory where you have rights to create files, and run the following command to create a new Express app that uses [Handlebars](http://handlebarsjs.com/) as the rendering engine.

    ```Shell
    npx express-generator --hbs graph-tutorial
    ```

    The Express generator creates a new directory called `graph-tutorial` and scaffolds an Express app.

1. Navigate to the `graph-tutorial` directory and enter the following command to install dependencies.

    ```Shell
    npm install
    ```

1. Run the following command to update Node packages with reported vulnerabilities.

    ```Shell
    npm audit fix
    ```

1. Run the following command to update the version of Express and other dependencies.

    ```Shell
    npm install express@4.17.1 http-errors@1.8.0 morgan@1.10.0 debug@4.3.1 hbs@4.1.2
    ```

1. Use the following command to start a local web server.

    ```Shell
    npm start
    ```

1. Open your browser and navigate to `http://localhost:3000`. If everything is working, you will see a "Welcome to Express" message. If you don't see that message, check the [Express getting started guide](http://expressjs.com/starter/generator.html).

## Install Node packages

Before moving on, install some additional packages that you will use later:

- [dotenv](https://github.com/motdotla/dotenv) for loading values from a .env file.
- [date-fns](https://github.com/date-fns/date-fns) for formatting date/time values.
- [windows-iana](https://github.com/rubenillodo/windows-iana) for translating Windows time zone names to IANA time zone IDs.
- [connect-flash](https://github.com/jaredhanson/connect-flash) to flash error messages in the app.
- [express-session](https://github.com/expressjs/session) to store values in an in-memory server-side session.
- [express-promise-router](https://github.com/express-promise-router/express-promise-router) to allow route handlers to return a Promise.
- [express-validator](https://github.com/express-validator/express-validator) for parsing and validating form data.
- [msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) for authenticating and getting access tokens.
- [microsoft-graph-client](https://github.com/microsoftgraph/msgraph-sdk-javascript) for making calls to Microsoft Graph.
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) to polyfill the fetch for Node. A fetch polyfill is required for the `microsoft-graph-client` library. See the [Microsoft Graph JavaScript client library wiki](https://github.com/microsoftgraph/msgraph-sdk-javascript/wiki/Migration-from-1.x.x-to-2.x.x#polyfill-only-when-required) for more information.
- [qs](https://github.com/ljharb/qs) to build URL query strings.

1. Run the following command in your CLI.

    ```Shell
    npm install dotenv@10.0.0 date-fns@2.23.0 date-fns-tz@1.1.6 connect-flash@0.1.1 express-validator@6.12.1
    npm install express-session@1.17.2 express-promise-router@4.1.0 isomorphic-fetch@3.0.0
    npm install @azure/msal-node@1.3.0 @microsoft/microsoft-graph-client@3.0.0 windows-iana@5.0.2
    ```

    > [!TIP]
    > Windows users may get the following error message when trying to install these packages on Windows.
    >
    > ```Shell
    > gyp ERR! stack Error: Can't find Python executable "python", you can set the PYTHON env variable.
    > ```
    >
    > To resolve the error, run the following command to install the Windows Build Tools using an elevated (Administrator) terminal window which installs the VS Build Tools and Python.
    >
    > ```Shell
    > npm install --global --production windows-build-tools
    > ```

1. Update the application to use the `connect-flash` and `express-session` middleware. Open **./app.js** and add the following `require` statement to the top of the file.

    ```javascript
    const session = require('express-session');
    const flash = require('connect-flash');
    const msal = require('@azure/msal-node');
    ```

1. Add the following code immediately after the `var app = express();` line.

    :::code language="javascript" source="../demo/graph-tutorial/app.js" id="SessionSnippet":::

## Design the app

In this section you will implement the UI for the app.

1. Open **./views/layout.hbs** and replace the entire contents with the following code.

    :::code language="html" source="../demo/graph-tutorial/views/layout.hbs" id="LayoutSnippet":::

    This code adds [Bootstrap](http://getbootstrap.com/) for simple styling. It also defines a global layout with a nav bar.

1. Open **./public/stylesheets/style.css** and replace its entire contents with the following.

    :::code language="css" source="../demo/graph-tutorial/public/stylesheets/style.css":::

1. Open **./views/index.hbs** and replace its contents with the following.

    :::code language="html" source="../demo/graph-tutorial/views/index.hbs" id="IndexSnippet":::

1. Open **./routes/index.js** and replace the existing code with the following.

    :::code language="javascript" source="../demo/graph-tutorial/routes/index.js" id="IndexRouterSnippet" highlight="6-10":::

1. Add an image file of your choosing named **no-profile-photo.png** in the **./public/images** directory. This image will be used as the user's photo when the user has no photo in Microsoft Graph.

1. Save all of your changes and restart the server. Now, the app should look very different.

    ![A screenshot of the redesigned home page](./images/create-app-01.png)
