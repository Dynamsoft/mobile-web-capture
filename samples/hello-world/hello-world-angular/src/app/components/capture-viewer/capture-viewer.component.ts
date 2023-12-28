import { Component, Input, SimpleChanges } from '@angular/core';
import { CaptureVisionRouter, LicenseManager } from 'dynamsoft-capture-vision-router';
import { DDV } from 'dynamsoft-document-viewer';
import type { CaptureViewer, IDocument } from 'dynamsoft-document-viewer';
import { initDocDetectModule } from '../../utils/initDocDetectModule';
import { CapturedImages } from '../../app.component';
import "dynamsoft-document-viewer/dist/ddv.css"

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
    DDV.on("error", (e: any) => {
      alert(e.message)
    });

    await DDV.setConfig({
      license: 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
      engineResourcePath: 'https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@1.0.0/dist/engine'
    });

    LicenseManager.initLicense(
      'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9'
    );
    CaptureVisionRouter.engineResourcePath =
      'https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.0.11/dist/';
    CaptureVisionRouter.preloadModule(['DDN']);
  
    const router = await CaptureVisionRouter.createInstance();
    await initDocDetectModule(DDV, router);

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
    });

    this.captureViewer.on("captured",async (e) => {
      const doc = (this.captureViewer as CaptureViewer).currentDocument as IDocument;
      const pageData = await doc.getPageData(e.pageUid) as any;
      this.switchVisibility(false);
      this.setImages({
        originalImage: URL.createObjectURL(pageData.raw.data),
        detectedImage: URL.createObjectURL(pageData.display.data)
      })
    });
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
