<!-- markdownlint-disable MD002 MD041 -->

In this exercise you will use [Express](http://expressjs.com/) to build a web app.

1. Open your CLI, navigate to a directory where you have rights to create files, and run the following command to create a new Express app that uses [Handlebars](http://handlebarsjs.com/) as the rendering engine.

    ```Shell
    npx express-generator@4.16.1 --hbs graph-tutorial
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

1. Use the following command to start a local web server.

    ```Shell
    npm start
    ```

1. Open your browser and navigate to `http://localhost:3000`. If everything is working, you will see a "Welcome to Express" message. If you don't see that message, check the [Express getting started guide](http://expressjs.com/starter/generator.html).

## Install Node packages

Before moving on, install some additional packages that you will use later:

- [dotenv](https://github.com/motdotla/dotenv) for loading values from a .env file.
- [moment](https://github.com/moment/moment/) for formatting date/time values.
- [connect-flash](https://github.com/jaredhanson/connect-flash) to flash error messages in the app.
- [express-session](https://github.com/expressjs/session) to store values in an in-memory server-side session.
- [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad) for authenticating and getting access tokens.
- [simple-oauth2](https://github.com/lelylan/simple-oauth2) for token management.
- [microsoft-graph-client](https://github.com/microsoftgraph/msgraph-sdk-javascript) for making calls to Microsoft Graph.
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) to polyfill the fetch for Node. A fetch polyfill is required for the `microsoft-graph-client` library. See the [Microsoft Graph JavaScript client library wiki](https://github.com/microsoftgraph/msgraph-sdk-javascript/wiki/Migration-from-1.x.x-to-2.x.x#polyfill-only-when-required) for more information.

1. Run the following command in your CLI.

    ```Shell
    npm install dotenv@8.2.0 moment@2.25.3 connect-flash@0.1.1 express-session@1.17.1 isomorphic-fetch@2.2.1
    npm install passport-azure-ad@4.2.1 simple-oauth2@3.4.0 @microsoft/microsoft-graph-client@2.0.0
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

1. Update the application to use the `connect-flash` and `express-session` middleware. Open the `./app.js` file and add the following `require` statement to the top of the file.

    ```javascript
    var session = require('express-session');
    var flash = require('connect-flash');
    ```

1. Add the following code immediately after the `var app = express();` line.

    :::code language="javascript" source="../demo/graph-tutorial/app.js" id="SessionSnippet":::

## Design the app

In this section you will implement the UI for the app.

1. Open the `./views/layout.hbs` file and replace the entire contents with the following code.

    :::code language="html" source="../demo/graph-tutorial/views/layout.hbs" id="LayoutSnippet":::

    This code adds [Bootstrap](http://getbootstrap.com/) for simple styling, and [Font Awesome](https://fontawesome.com/) for some simple icons. It also defines a global layout with a nav bar.

1. Open `./public/stylesheets/style.css` and replace its entire contents with the following.

    :::code language="css" source="../demo/graph-tutorial/public/stylesheets/style.css":::

1. Open the `./views/index.hbs` file and replace its contents with the following.

    :::code language="html" source="../demo/graph-tutorial/views/index.hbs" id="IndexSnippet":::

1. Open the `./routes/index.js` file and replace the existing code with the following.

    :::code language="javascript" source="../demo/graph-tutorial/routes/index.js" id="IndexRouterSnippet" highlight="6-10":::

1. Save all of your changes and restart the server. Now, the app should look very different.

    ![A screenshot of the redesigned home page](./images/create-app-01.png)
