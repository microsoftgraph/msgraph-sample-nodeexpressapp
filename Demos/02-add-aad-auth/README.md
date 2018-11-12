# Completed module: Add Azure AD authentication

The version of the project in this directory reflects completing the tutorial up through [Add Azure AD authentication](https://docs.microsoft.com/graph/training/node-tutorial?tutorial-step=3). If you use this version of the project, you need to complete the rest of the tutorial starting at [Get calendar data](https://docs.microsoft.com/graph/training/node-tutorial?tutorial-step=4).

> **Note:** It is assumed that you have already registered an application in the app registration portal as specified in [Register the app in the portal](https://docs.microsoft.com/graph/training/node-tutorial?tutorial-step=2). You need to configure this version of the sample as follows:
>
> 1. Rename the `.env.example` file to `.env`.
> 1. Edit the `.env` file and make the following changes.
>     1. Replace `YOUR_APP_ID_HERE` with the **Application Id** you got from the App Registration Portal.
>     1. Replace `YOUR_APP_PASSWORD_HERE` with the password you got from the App Registration Portal.