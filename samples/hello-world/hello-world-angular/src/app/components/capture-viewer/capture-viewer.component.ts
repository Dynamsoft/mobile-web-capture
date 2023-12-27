import { Component, Input, SimpleChanges } from '@angular/core';
import { CaptureVisionRouter, LicenseManager } from 'dynamsoft-capture-vision-router';
import { DDV } from 'dynamsoft-document-viewer';
import type { CaptureViewer, IDocument } from 'dynamsoft-document-viewer';
import "dynamsoft-document-viewer/dist/ddv.css"
import { initDocDetectModule } from '../../utils/initDocDetectModule';
import { CapturedImages } from '../../app.component';

@Component({
  selector: 'app-capture-viewer',
  standalone: true,
  imports: [],
  templateUrl: './capture-viewer.component.html',
  styleUrl: './capture-viewer.component.css'
})

export class CaptureViewerComponent {
  @Input() showCaptureViewer: boolean = true;
  @Input() switchVisibility: (value: boolean) => void = () => {};
  @Input() setImages: (value: CapturedImages) => void = () => {};
  captureViewer: CaptureViewer | null = null;

  async ngOnInit() {
    await DDV.setConfig({
      license:
        'f0099mgAAAJ6zGNMjgq6hDnJnu0i63Wy3J35NFlD8WG1Ra7Qi3xh/QODuqGye7KiY5zMiptUuQhk5x79YUkETGgUUGTTi0RQ+umEUIDgBkYENYvAGNQSn9Wu6v9vko+ee8QDJ5yED',
      // The wasm path needs to be changed to the CDN.
      engineResourcePath: 'https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@latest/dist/engine'
    });

    DDV.on("error", (e: any) => {
      alert(e.message)
  })

    LicenseManager.initLicense(
      'DLS2eyJoYW5kc2hha2VDb2RlIjoiMjM0ODEwLVRYbFhaV0pRY205cSIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMjM0ODEwIiwic3RhbmRieVNlcnZlclVSTCI6Imh0dHBzOi8vc2x0cy5keW5hbXNvZnQuY29tIiwiY2hlY2tDb2RlIjotMjA0MzA5ODk1NH0='
    )
    CaptureVisionRouter.engineResourcePath =
      'https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.0.11/dist/'
    CaptureVisionRouter.preloadModule(['DDN'])
  
    const router = await CaptureVisionRouter.createInstance()
    await initDocDetectModule(DDV, router)

    this.captureViewer = new DDV.CaptureViewer({
      container: 'viewerContainer',
      viewerConfig: {
        acceptedPolygonConfidence: 60,
        enableAutoCapture: true,
        enableAutoDetect: true
      }
    });

    this.captureViewer.play({
      resolution: [1920, 1080]
    })

    this.captureViewer.on("captured",async (e) => {
      const doc = (this.captureViewer as CaptureViewer).currentDocument as IDocument;
      const pageData = await doc.getPageData(e.pageUid) as any;
      this.switchVisibility(false);
      this.setImages({
        originalImage: URL.createObjectURL(pageData.raw.data),
        detectedImage: URL.createObjectURL(pageData.display.data)
      })
    })
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['showCaptureViewer']) {
      const oldValue = changes['showCaptureViewer'].previousValue;
      const newValue = changes['showCaptureViewer'].currentValue;
      if(oldValue !== newValue) {
        if(newValue === true) {
          this.captureViewer?.currentDocument?.deleteAllPages();
          this.captureViewer?.play();
        } else {
          this.captureViewer?.stop()
        }
      }
    }
  }
}
