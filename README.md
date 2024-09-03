# Mobile Web Capture - User Guide

[Mobile Web Capture](https://www.dynamsoft.com/use-cases/mobile-web-capture-sdk/?utm_content=nav-solutions) is a solution designed for iOS and Android browsers. It helps developers to build document scanning web applications for mobile users to load, edit, save, and capture images from the camera right in mobile browsers.


<span style="font-size:20px">Table of Contents</span>

- [Samples](#samples)
- [License Key](#license-key)
- [System Requirements](#system-requirements)
- [Documentation](#documentation)
- [Release Notes](#release-notes)
- [Featured Products](#featured-products)

## Samples

- Hello World - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/gettingstarted/helloworld-singlepage.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world/hello-world) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world-singlepage/hello-world/)
  - Angular App - [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world-singlepage/hello-world-angular) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world-singlepage/hello-world-angular/)
  - React App - [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world-singlepage/hello-world-react) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world-singlepage/hello-world-react/)
  - Vue3 App - [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world-singlepage/hello-world-vue3) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world-singlepage/hello-world-vue3/)
- Popular use cases
  - Capture Single Page and Then Crop - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/codegallery/usecases/capture-single-page-and-then-crop.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/capture-single-page-and-then-crop) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/capture-single-page-and-then-crop/)
  - Complete Document Capturing Workflow - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/codegallery/usecases/complete-doc-capturing-workflow.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/complete-document-capturing-workflow) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/complete-document-capturing-workflow/)
  - Detect boundaries on the existing image - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/codegallery/usecases/detect-boundaries-on-existing-image.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/detect-boundaries-on-existing-image) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/detect-boundaries-on-existing-image/)

## License Key

[![](https://img.shields.io/badge/Get-30--day%20FREE%20Trial%20License-blue)](https://www.dynamsoft.com/customer/license/trialLicense/?product=mwc&utm_source=npm)

The following code snippet is using the public trial license to initialize the license. You can replace the public trial license with your own license key.

```typescript
await Dynamsoft.License.LicenseManager.initLicense("DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTEwMjQ5NjE5NyJ9", true); // Replace license here
```

## System Requirements

Mobile Web Capture requires the following features to work:

- Secure context (HTTPS deployment)

- set Content-Type: application/wasm.

*Note*:

If you open the web page as `file:///` or `http://` , the camera may not work correctly because the API <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia" title="getUserMedia">getUserMedia</a> usually requires HTTPS to access the camera.

To make sure your web application can access the camera, please configure your web server to support HTTPS. The following links may help.

- NGINX: <a target="_blank" href="https://nginx.org/en/docs/http/configuring_https_servers.html" title="Configuring HTTPS servers">Configuring HTTPS servers</a>
- IIS: <a target="_blank" href="https://aboutssl.org/how-to-create-a-self-signed-certificate-in-iis/" title="Create a Self Signed Certificate in IIS">Create a Self Signed Certificate in IIS</a>
- Tomcat: <a target="_blank" href="https://dzone.com/articles/setting-ssl-tomcat-5-minutes" title="Setting Up SSL on Tomcat in 5 minutes">Setting Up SSL on Tomcat in 5 minutes</a>
- Node.js: <a target="_blank" href="https://nodejs.org/docs/v0.4.1/api/tls.html" title="npm tls">npm tls</a>

If the test doesn't go as expected, you can [contact us](https://www.dynamsoft.com/contact/).

### Supported Browsers

The following table is a list of supported browsers based on the above requirements:

| Browser Name |             Version              |
| :----------: | :------------------------------: |
|    Chrome    |             v78+                 |
|   Firefox    |             v79+                 |
|    Safari    |             v15+                 |
|     Edge     |             v92+                 |

Apart from the browsers, the operating systems may impose some limitations of their own that could restrict the use of the SDKs.

## Documentation

You can check out the detailed documentation of the solution [here](https://www.dynamsoft.com/mobile-web-capture/docs/introduction/index.html).

## Release Notes

Check out the [release notes](https://www.dynamsoft.com/mobile-web-capture/docs/releasenotes/index.html).

## Featured Products

- [Dynamsoft Document Viewer](https://www.dynamsoft.com/document-viewer/docs/introduction/index.html)
- [Dynamsoft Document Normalizer](https://www.dynamsoft.com/document-normalizer/docs/web/programming/javascript/)