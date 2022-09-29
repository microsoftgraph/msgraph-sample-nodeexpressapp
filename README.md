---
page_type: sample
description: This sample demonstrates how to use the Microsoft Graph JavaScript SDK to access data in Office 365 from Node.js Express apps.
products:
- ms-graph
- microsoft-graph-calendar-api
- office-exchange-online
languages:
- nodejs
---

# Microsoft Graph sample Node.js Express app

[![Node.js build](https://github.com/microsoftgraph/msgraph-training-nodeexpressapp/actions/workflows/node.js.yml/badge.svg)](https://github.com/microsoftgraph/msgraph-training-nodeexpressapp/actions/workflows/node.js.yml) ![License.](https://img.shields.io/badge/license-MIT-green.svg)

This sample demonstrates how to use the Microsoft Graph JavaScript SDK to access data in Office 365 from Node.js Express apps.

## Prerequisites

To run the completed project in this folder, you need the following:

- [Node.js](https://nodejs.org) installed on your development machine. If you do not have Node.js, visit the previous link for download options.
- Either a personal Microsoft account with a mailbox on Outlook.com, or a Microsoft work or school account.

If you don't have a Microsoft account, there are a couple of options to get a free account:

- You can [sign up for a new personal Microsoft account](https://signup.live.com/signup?wa=wsignin1.0&rpsnv=12&ct=1454618383&rver=6.4.6456.0&wp=MBI_SSL_SHARED&wreply=https://mail.live.com/default.aspx&id=64855&cbcxt=mai&bk=1454618383&uiflavor=web&uaid=b213a65b4fdc484382b6622b3ecaa547&mkt=E-US&lc=1033&lic=1).
- You can [sign up for the Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program) to get a free Microsoft 365 subscription.

## Register a web application with the Azure Active Directory admin center

1. Open a browser and navigate to the Azure Active Directory admin center. Login using a **personal account** (aka: Microsoft Account) or **Work or School Account**.

1. Select **Azure Active Directory** in the left-hand navigation, then select **App registrations** under **Manage**.

1. Select **New registration**. On the **Register an application** page, set the values as follows.

    - Set **Name** to `Node.js Graph Sample`.
    - Set **Supported account types** to **Accounts in any organizational directory and personal Microsoft accounts**.
    - Under **Redirect URI**, set the first drop-down to `Web` and set the value to `http://localhost:3000/auth/callback`.

1. Choose **Register**. On the **Node.js Graph Sample** page, copy the value of the **Application (client) ID** and save it, you will need it in the next step.

1. Select **Certificates & secrets** under **Manage**. Select the **New client secret** button. Enter a value in **Description** and select one of the options for **Expires** and choose **Add**.

1. Copy the client secret value before you leave this page. You will need it in the next step.

    > [!IMPORTANT]
    > This client secret is never shown again, so make sure you copy it now.

## Configure the sample

1. Rename the `example.env` file to `.env`.
1. Edit the `.env` file and make the following changes.
    1. Replace `YOUR_CLIENT_ID_HERE` with the **Application Id** you got from the App Registration Portal.
    1. Replace `YOUR_CLIENT_SECRET_HERE` with the client secret you got from the App Registration Portal.
1. In your command-line interface (CLI), navigate to the **graph-sample** directory and run the following command to install requirements.

    ```Shell
    npm install
    ```

## Run the sample

1. Run the following command in your CLI to start the application.

    ```Shell
    npm start
    ```

1. Open a browser and browse to `http://localhost:3000`.

## Code of conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
