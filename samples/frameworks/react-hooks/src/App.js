import { useEffect } from "react";
import { MobileWebCapture } from "dynamsoft-mobile-web-capture";
import reactLogo from "./logo.svg";
import "./App.css";

function App() {
  useEffect(() => {
    // Visit https://www.dynamsoft.com/mobile-web-capture/docs/guides/mobile-web-capture-customization.html for more customization options
    // Configuration object for initializing the Mobile Web Capture instance
    const config = {
      license: "YOUR_LICENSE_KEY_HERE", // Replace with your Dynamsoft license key
      documentScannerConfig: {
        scannerViewConfig: {
          enableAutoCropMode: true, // Enables auto crop and smart capture
        },
      },
    };

    const mobileWebCapture = new MobileWebCapture(config);

    mobileWebCapture.launch();
  }, []);

  return (
    <div className="mwc-hello-world-page">
      <div className="mwc-title">
        <h2 className="mwc-title-text">Hello World for React</h2>
        <img className="mwc-title-logo" src={reactLogo} alt="logo"></img>
      </div>
    </div>
  );
}

export default App;
