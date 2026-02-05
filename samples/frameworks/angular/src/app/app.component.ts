import { Component, OnInit } from '@angular/core';

import { MobileWebCapture } from 'dynamsoft-mobile-web-capture';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Visit https://www.dynamsoft.com/mobile-web-capture/docs/guides/mobile-web-capture-customization.html for more customization options
    // Configuration object for initializing the Mobile Web Capture instance
    const config = {
      license: 'YOUR_LICENSE_KEY_HERE', // Replace with your Dynamsoft license key
      documentScannerConfig: {
        scannerViewConfig: {
          enableAutoCropMode: true, // Enables auto crop and smart capture
        },
      },
    };

    const mobileWebCapture = new MobileWebCapture(config);

    // Launch the capture interface
    mobileWebCapture.launch();
  }
}
