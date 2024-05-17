# Hello World Angular App

This project was bootstrapped with [Angular CLI](https://github.com/angular/angular-cli). It utilizes the solution [Mobile Web Capture](https://www.dynamsoft.com/use-cases/mobile-web-capture-sdk/?utm_content=nav-solutions) to provide the following functionalities

- Auto capture document from Mobile Cameras
- Real-time document boundaries detection
- Normalize the captured document

## Usage

Environment: Node.js v18.14.0

1. Apply for a [30-day free trial license](https://www.dynamsoft.com/customer/license/trialLicense?product=mwc) of Mobile Web Capture.

2. Update the license key in `src\app\components\capture-viewer\capture-viewer.component.ts` file:

   ```javascript
   // your license key
   await LicenseManager.initLicense('DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTEwMjQ5NjE5NyJ9', true); 
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

Run `npm run build` to build the project. The build artifacts will be stored in the `build/` directory. 
It correctly bundles Angular in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!
