# Register a web application with the Application Registration Portal

In this demo, you will create a new Azure AD web application registration using the Application Registry Portal (ARP).

1. Open a browser and navigate to the [Application Registration Portal](https://apps.dev.microsoft.com). Login using a **personal account** (aka: Microsoft Account) or **Work or School Account**.

1. Select **Add an app** at the top of the page.

    > **Note:** If you see more than one **Add an app** button on the page, select the one that corresponds to the **Converged apps** list.

1. On the **Register your application** page, set the **Application Name** to **Node.js Graph Tutorial** and select **Create**.

    ![Screenshot of creating a new app in the App Registration Portal website](/Images/arp-create-app-01.png)

1. On the **Node.js Graph Tutorial Registration** page, under the **Properties** section, copy the **Application Id** as you will need it later.

    ![Screenshot of newly created application's ID](/Images/arp-create-app-02.png)

1. Scroll down to the **Application Secrets** section.

    1. Select **Generate New Password**.
    1. In the **New password generated** dialog, copy the contents of the box as you will need it later.

        > **Important:** This password is never shown again, so make sure you copy it now.

    ![Screenshot of newly created application's password](/Images/arp-create-app-03.png)

1. Scroll down to the **Platforms** section.

    1. Select **Add Platform**.
    1. In the **Add Platform** dialog, select **Web**.

        ![Screenshot creating a platform for the app](/Images/arp-create-app-04.png)

    1. In the **Web** platform box, enter the URL `http://localhost:8000/auth/callback` for the **Redirect URLs**.

        ![Screenshot of the newly added Web platform for the application](/Images/arp-create-app-05.png)

1. Scroll to the bottom of the page and select **Save**.

## Next steps

Now that you've created the app registration, you can continue to the next module, [Extend the Node.js app for Azure AD Authentication](../03-add-aad-auth/README.md).