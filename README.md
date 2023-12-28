# Mobile Web Capture - User Guide

[Mobile Web Capture](https://www.dynamsoft.com/use-cases/mobile-web-capture-sdk/?utm_content=nav-solutions) is a solution designed for iOS and Android browsers. It helps developers to build document scanning web applications for mobile users to load, edit, save, and capture images from the camera right in mobile browsers.


Featured Products:

- [Dynamsoft Document Viewer](https://www.dynamsoft.com/document-viewer/docs/introduction/index.html)
- [Dynamsoft Document Normalizer](https://www.dynamsoft.com/document-normalizer/docs/web/programming/javascript/)


<span style="font-size:20px">Table of Contents</span>

- [Samples](#samples)
- [License Key](#license-key)
- [System Requirements](#system-requirements)
- [Documentation](#documentation)
- [Release Notes](#release-notes)
- [Next Steps](#next-steps)

## Samples

- Hello World - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/gettingstarted/helloworld.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world/hello-world) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world/hello-world/)
  - Angular App - [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world/hello-world-angular) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world/hello-world-angular/)
  - React App - [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world/hello-world-react) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world/hello-world-react/)
  - Vue3 App - [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/hello-world/hello-world-vue3) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/hello-world/hello-world-vue3/)
- Popular use cases
  - Review and Adjust the detected boundaries - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/codegallery/usecases/review-adjust-detected-boundaries.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/review-adjust-detected-boundaries) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/review-adjust-detected-boundaries/)
  - Capture continuously & Edit result images - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/codegallery/usecases/capture-continuously-edit-result-images.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/capture-continuously-edit-result-images) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/capture-continuously-edit-result-images/)
  - Relatively complete document capturing workflow - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/codegallery/usecases/relatively-complete-doc-capturing-workflow.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/relatively-complete-doc-capturing-workflow) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/relatively-complete-doc-capturing-workflow/)
  - Detect boundaries on the existing images - [Guide](https://www.dynamsoft.com/mobile-web-capture/docs/codegallery/usecases/detect-boundaries-on-existing-images.html) \| [Github](https://github.com/Dynamsoft/mobile-web-capture/tree/master/samples/detect-boundaries-on-existing-images) \| [Run](https://dynamsoft.github.io/mobile-web-capture/samples/detect-boundaries-on-existing-images/)

## License Key

[![](https://img.shields.io/badge/Get-30--day%20FREE%20Trial%20License-blue)](https://www.dynamsoft.com/customer/license/trialLicense/?product=mwc&utm_source=npm)

## System Requirements

Mobile Web Capture requires the following features to work:

- Secure context (HTTPS deployment)

  When deploying your application / website for production, make sure to serve it via a secure HTTPS connection. This is required for two reasons

  - Access to the camera video stream is only granted in a security context. Most browsers impose this restriction.
    
  > Some browsers like Chrome may grant the access for `http://127.0.0.1` and `http://localhost` or even for pages opened directly from the local disk (`file:///...`). This can be helpful for temporary development and test.
  
  - Dynamsoft License requires a secure context to work.

- `WebAssembly`, `Blob`, `URL`/`createObjectURL`, `Web Workers`

  The above four features are required for the SDK to work.

## Documentation

You can check out the detailed documentation of the solution [here](https://www.dynamsoft.com/mobile-web-capture/docs/introduction/index.html).

## Release Notes

Check out the [release notes](https://www.dynamsoft.com/mobile-web-capture/docs/releasenotes/index.html).

