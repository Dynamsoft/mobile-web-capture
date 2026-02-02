---
layout: default-layout
needAutoGenerateSidebar: true
needGenerateH3Content: true
noTitleIndex: false
title: Mobile Document Scanner JS Edition - Scan Multi-Page Documents
keywords: Documentation, Mobile Document Scanner, Web, JS Edition, Mobile Web Capture, Dynamsoft Document Scanner,
description: Mobile Document Scanner JS Edition User Guide
---

# Extend Mobile Document Scanner to Full Document Management

> Prerequisites: read the [Introduction](https://www.dynamsoft.com/mobile-document-scanner/docs/web/introduction/index.html) before proceeding.

**Mobile Web Capture (MWC)** is an advanced sample designed to extend the features of [Mobile Document Scanner (MDS)](https://www.dynamsoft.com/mobile-document-scanner/docs/web/guide/index.html) for managing and scanning multi-page documents. It integrates **Mobile Document Scanner (MDS)** functionality while offering additional features such as multi-document management, annotation, and uploading by integrating **Dynamsoft Document Viewer (DDV)**, making it a comprehensive solution for managing complex document workflows.

> See it in action with the [Mobile Web Capture Demo](https://demo.dynamsoft.com/mobile-web-capture/).

This guide walks you through building a web application that scans multi-page documents using **MWC**, with **pre-defined configurations**.

**Table of Contents**
- [License](#license)
  - [Get a Trial License](#get-a-trial-license)
  - [Get a Full License](#get-a-full-license)
- [Quick Start](#quick-start)
  - [Option 1: Build from Source](#option-1-build-from-source)
  - [Option 2: Use Precompiled Script](#option-2-use-precompiled-script)
- [Hello World Sample Explained](#hello-world-sample-explained)
  - [Reference MWC](#reference-mwc)
  - [Instantiate MWC](#instantiate-mwc)
  - [Launch MWC](#launch-mwc)
- [Next Step](#next-step)

## License

### Get a Trial License

If you do not have a trial license for **MWC**, you can request one through our [customer portal](https://www.dynamsoft.com/customer/license/trialLicense?product=mwc&source=guide). The trial can be renewed twice for up to two months of free access.

> **MDS** and **MWC** share the same license keys. If you already have a **MDS** license, you can use it for **MWC**, and vice versa.

### Get a Full License

To purchase a full license, [contact us](https://www.dynamsoft.com/company/contact?product=mwc&utm_source=github_readme).

## Quick Start

To use **MWC**, the first step is to obtain its library files. You can acquire them from one of the following sources:

1. [**GitHub**](https://github.com/Dynamsoft/mobile-web-capture) – Contains the source files for the **MWC** sample, which can be compiled into library files.
2. [**npm**](https://www.npmjs.com/package/dynamsoft-mobile-web-capture) – Provides precompiled library files via npm for easier installation.
3. [**CDN**](https://cdn.jsdelivr.net/npm/dynamsoft-mobile-web-capture) – Delivers precompiled library files through a CDN for quick and seamless integration.

You can choose one of the following methods to set up a Hello World page:

1. **Build from Source** – Download the source files from GitHub and compile the resource scripts yourself.
2. **Using Precompiled Script** – Use the precompiled resource scripts from npm or the CDN for a quicker setup.

### Option 1: Build from Source

This method retrieves all **MWC** source files from its [GitHub Repository](https://github.com/Dynamsoft/mobile-web-capture), compiles them into a distributable package, and then runs a *ready-made* Hello World sample page included in the repository.

Follow these steps:

1. Download **MWC** from [GitHub](https://github.com/Dynamsoft/mobile-web-capture) as a compressed folder.
2. Extract the contents of the archive.
3. Enter the license key you received from [Get a Trial License](#get-a-trial-license).
   > In your code editor, open the Hello World sample located at [`/samples/hello-world.html`](https://github.com/Dynamsoft/mobile-web-capture/blob/main/samples/hello-world.html). Search for `"YOUR_LICENSE_KEY_HERE"` and replace it with your actual license key.
4. Install project dependencies
    In the terminal, navigate to the project root directory and run:
    ```shell
    npm install
    ```
5. Build the project
    After the dependencies are installed, build the project by running:
    ```shell
    npm run build
    ```
6. Serve the project locally
    Start the local server by running:
    ```shell
    npm run serve
    ```
Once the server is running, open the application in a browser using the address provided in the terminal output after running `npm run serve`.

> See the server configuration details in [`/dev-server/index.js`](https://github.com/Dynamsoft/mobile-web-capture/blob/main/dev-server/index.js).

### Option 2: Use Precompiled Script

Since the **MWC** library files are published on [npm](https://www.npmjs.com/package/dynamsoft-mobile-web-capture), it's easy to reference them from a CDN.

To use the precompiled script, simply include the following URL in a `<script>` tag:
```html
<script src="https://cdn.jsdelivr.net/npm/dynamsoft-mobile-web-capture@4.0.0/dist/mwc.bundle.js"></script>
```

Below is the complete Hello World sample page that uses this precompiled script from a CDN.

> This code is identical to the [`/samples/hello-world.html`](https://github.com/Dynamsoft/mobile-web-capture/blob/main/samples/hello-world.html) file mentioned in the [Build from Source](#option-1-build-from-source) section, except for the script source.

> **Don't forget** to replace `"YOUR_LICENSE_KEY_HERE"` with your actual license key.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mobile Web Capture - Hello World</title>
    <script src="https://cdn.jsdelivr.net/npm/dynamsoft-mobile-web-capture@4.0.0/dist/mwc.bundle.js"></script>
  </head>
  <body>
    <script>
      // Instantiate a Mobile Web Capture Object
      const mobileWebCapture = new Dynamsoft.MobileWebCapture({
        license: "YOUR_LICENSE_KEY_HERE", // Replace this with your actual license key
      });
      (async () => {
        // Launch the Mobile Web Capture Instance
        const fileName = `New_Document_${Date.now().toString().slice(-5)}`;
        await mobileWebCapture.launch(fileName);
      })();
    </script>
  </body>
</html>
```

To run the sample, create a new file called `hello-world.html`, then copy and paste the code above into the file. Next, serve the page from a local web server.

If you are using VS Code, a quick and easy way to serve the project is to use the [Live Server (Five Server) VSCode extension](https://marketplace.visualstudio.com/items?itemName=yandeu.five-server). Simply install the extension, open the `hello-world.html` file in the editor, and click "Go Live" in the bottom-right corner of the editor. This will serve the application at `http://127.0.0.1:5500/hello-world.html`.

Alternatively, you can use other servers like `IIS` or `Apache`, but they are outside the scope of this guide for brevity.

## Hello World Sample Explained

Let’s walk through the code in the Hello World sample to understand how it works.

> Instead of using the code above, an alternative way to view the full code is by visiting the [Mobile Web Capture Hello World Sample](https://github.com/Dynamsoft/mobile-web-capture/blob/main/samples/hello-world.html).

### Reference MWC

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mobile Web Capture - Hello World</title>
    <script src="../dist/mwc.bundle.js"></script>
    <!--Alternatively, reference the script from CDN
    <script src="https://cdn.jsdelivr.net/npm/dynamsoft-mobile-web-capture@4.0.0/dist/mwc.bundle.js"></script>
    -->
  </head>
```

In this step, **MWC** is referenced using a relative local path in the `<head>` section of the HTML.

```html
<script src="../dist/mwc.bundle.js"></script>
```

Alternatively, the script can be referenced from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/dynamsoft-mobile-web-capture@4.0.0/dist/mwc.bundle.js"></script>
```

**MWC** wraps all its dependency scripts, so a **MWC** project only needs to include **MWC** itself as a single script. No additional dependency scripts are required.

> Even if you reference the script locally, supporting resources like `.wasm` engine files are still loaded from the CDN at runtime. If you require a **fully offline setup**, follow the instructions in [Self-Hosting Resource File](https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/customization-guide.html#self-hosting-resource-files).

### Instantiate MWC

```javascript
// Instantiate a Mobile Web Capture Object
const mobileWebCapture = new Dynamsoft.MobileWebCapture({
    license: "YOUR_LICENSE_KEY_HERE", // Replace this with your actual license key
});
```

API Reference: [`MobileWebCapture()`](https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/api.html#mobilewebcapture)

This step creates the **MWC** UI, which, when launched, occupies the entire visible area of the browser window by default. If needed, you can specify a container to restrict the UI's size. For more details, refer to [Specify the UI Container](https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/customization-guide.html#example-1-specify-the-ui-container).

> A **license key** is required for the instantiation.

### Launch MWC

```javascript
const fileName = `New_Document_${Date.now().toString().slice(-5)}`; // Generates a unique filename to use as the initial document name
await mobileWebCapture.launch(fileName);
```

API Reference: [`launch()`](https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/api.html#launch)

This step launches the UI, starting in **`DocumentView`**, where the user can begin building a document in two ways:

> The `DocumentView` requires a document name, which is passed as a parameter in the `launch()` method.

1. **Capture**: Capture image(s) of the document pages.
2. **Import**: Import one or multiple images or PDF files.

Once a document has been created, the user can navigate between three views:

#### The DocumentView
The user can:

1. **Share**: Share the document as a multi-page PDF file.
   - **Download** is enabled where **Share** is not supported (e.g., in Firefox).
2. **Manage**: Select one or multiple pages for further actions.
3. **Manage** → **Select all**: Select all pages.
4. **Manage** → **Delete**: Delete selected pages from the document.
5. **Manage** → **Share**: Share individual pages as images (**.PNG**).
   - **Download** is enabled where **Share** is not supported (e.g., in Firefox).

The user can also enable the **Upload** feature. See [Enable File Upload](https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/customization-guide.html#enable-file-upload).

#### The PageView
When the user selects a page thumbnail, the `PageView` opens for that page, where the user can:

1. **Delete**: Remove the current page.
2. **Add Page**: Add more pages to the document.
3. **Share**: Share the current page as an image (**.png**).
   - **Download** is enabled where **Share** is not supported (e.g., in Firefox).
4. **Edit**: Display additional editing features to further process the page.
5. **Edit** → **Crop**: Select a portion of the page and crop.
6. **Edit** → **Rotate**: Rotate the page **90 degrees counterclockwise**.
7. **Edit** → **Filter**: Adjust the page's pixels.
8. **Edit** → **Annotate**: Add annotations to the page.

The user can also enable the **Upload** feature. See [Enable File Upload](https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/customization-guide.html#enable-file-upload).

## Next Step

Mobile Web Capture provides extensive customization options. Read on to explore the available customizations in the [MWC Customization Guide](https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/customization-guide.html).
