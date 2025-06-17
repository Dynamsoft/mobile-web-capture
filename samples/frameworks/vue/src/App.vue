<template>
  <div class="mwc-hello-world-page">
    <div class="mwc-title">
      <h2 class="mwc-title-text">Hello World for Vue</h2>
      <img class="mwc-title-logo" src="./assets/logo.svg" alt="logo" />
    </div>
  </div>
</template>

<script>
import { MobileWebCapture } from "dynamsoft-mobile-web-capture";

export default {
  name: "App",
  mounted() {
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
  },
};
</script>

<style>
.mwc-hello-world-page {
  width: 100%;
  height: 100%;
  text-align: center;
  color: white;
}

.mwc-title {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.mwc-title .mwc-title-logo {
  margin-left: 4px;
  width: 24px;
  height: 24px;
}
</style>
