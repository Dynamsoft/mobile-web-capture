import { CaptureVisionRouter } from "dynamsoft-capture-vision-router"
import { DDV } from "dynamsoft-document-viewer"
import { useEffect, useState } from "react"
import { initDocDetectModule } from "../utils/initDocDetectModule"
import { CoreModule } from "dynamsoft-core"
import { LicenseManager } from "dynamsoft-license"
import "dynamsoft-document-viewer/dist/ddv.css"
import 'dynamsoft-document-normalizer';

export default function CaptureViewer(props) {
    const [captureViewer, setCaptureViewer] = useState(null);

    const init = async () => {
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
      
        const viewer = new DDV.CaptureViewer({
          container: 'viewerContainer',
          viewerConfig: {
            acceptedPolygonConfidence: 60,
            enableAutoDetect: true
          }
        });

        setCaptureViewer(viewer);
      
        viewer.play({
          resolution: [1920, 1080]
        });
      
        viewer.on('captured', async (e) => {
          const pageData = await viewer.currentDocument.getPageData(e.pageUid);
          props.setImages({
            originalImage: URL.createObjectURL(pageData.raw.data),
            detectedImage: URL.createObjectURL(pageData.display.data)
          });
          props.setShowCaptureViewer(false);
        });
    }

    useEffect(() => {
      init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        if(props.showCaptureViewer) {
            captureViewer?.currentDocument.deleteAllPages();
            captureViewer?.play();
        } else {
            captureViewer?.stop();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.showCaptureViewer]);

    return (
        <div style={props.showCaptureViewer ? {} : { display: 'none' }} id="viewerContainer">

        </div>
    )
}