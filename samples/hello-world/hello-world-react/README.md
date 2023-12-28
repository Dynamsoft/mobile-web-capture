# Hello World React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It utilizes the solution [Mobile Web Capture](https://www.dynamsoft.com/use-cases/mobile-web-capture-sdk/?utm_content=nav-solutions) to provide the following functionalities

- Auto capture document from Mobile Cameras
- Real-time document boundaries detection
- Normalize the captured document

## Usage

Environment: Node.js v18.13.0

1. Apply for a [30-day free trial license](https://www.dynamsoft.com/customer/license/trialLicense?product=mwc) of Mobile Web Capture.

2. Update the license key in `src\app\components\CaptureViewer.js` file:

   ```javascript
   await DDV.setConfig({
      // your license key
      license: 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9', 
      engineResourcePath: 'https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@1.0.0/dist/engine'
   });
   
   // your license key
   LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9'); 
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Run the application as follows:

   ```
   npm run start
   ```

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `build/` directory. 
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!
