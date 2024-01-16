import type { CaptureViewer, IDocument } from 'dynamsoft-document-viewer';
import { Component, Input, SimpleChanges } from '@angular/core';
import { CaptureVisionRouter } from 'dynamsoft-capture-vision-router';
import { DDV } from 'dynamsoft-document-viewer';
import { initDocDetectModule } from '../../utils/initDocDetectModule';
import { CapturedImages } from '../../app.component';
import { CoreModule } from 'dynamsoft-core';
import { LicenseManager } from 'dynamsoft-license';
import 'dynamsoft-document-normalizer';

// The external CSS for an Angular project should be imported via the angular.json file.
// import "dynamsoft-document-viewer/dist/ddv.css"

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
    CoreModule.engineResourcePaths = {
      rootDirectory: "https://cdn.jsdelivr.net/npm/",
      core: "dynamsoft-core@3.0.30/dist/",
      cvr: "dynamsoft-capture-vision-router@2.0.30/dist/",
      ddn: "dynamsoft-document-normalizer@2.0.20/dist/",
      license: "dynamsoft-license@3.0.20/dist/",
      dip: "dynamsoft-image-processing@2.0.30/dist/",
      std: "dynamsoft-capture-vision-std@1.0.0/dist/",
    };
    CoreModule.loadWasm(["DDN"]);
  
    DDV.Core.engineResourcePath = 'https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@1.1.0/dist/engine';
    DDV.Core.loadWasm();
  
    await LicenseManager.initLicense('DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAwLXIxNzAzODM5ODkwIiwibWFpblNlcnZlclVSTCI6Imh0dHBzOi8vbWx0cy5keW5hbXNvZnQuY29tLyIsIm9yZ2FuaXphdGlvbklEIjoiMjAwMDAwIiwic3RhbmRieVNlcnZlclVSTCI6Imh0dHBzOi8vc2x0cy5keW5hbXNvZnQuY29tLyIsImNoZWNrQ29kZSI6MTgyNTQ5Njk4NH0=', true)
    await DDV.Core.init()
  
    const router = await CaptureVisionRouter.createInstance();
    await initDocDetectModule(DDV, router);

    this.captureViewer = new DDV.CaptureViewer({
      container: 'viewerContainer',
      viewerConfig: {
        acceptedPolygonConfidence: 60,
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
