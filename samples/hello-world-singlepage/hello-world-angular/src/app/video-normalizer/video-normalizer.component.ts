import { Component, ViewChild } from '@angular/core';
import { EnumCapturedResultItemType, type DSImageData } from "dynamsoft-core";
import { type NormalizedImageResultItem } from "dynamsoft-document-normalizer";
import { CameraEnhancer, CameraView, QuadDrawingItem, ImageEditorView } from "dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter, type SimplifiedCaptureVisionSettings } from "dynamsoft-capture-vision-router";
import { CapturedResultItem, OriginalImageResultItem, Point } from 'dynamsoft-core';

@Component({
  selector: 'app-video-normalizer',
  templateUrl: './video-normalizer.component.html',
  styleUrls: ['./video-normalizer.component.css']
})
export class VideoNormalizerComponent {
  cameraEnhancer: Promise<CameraEnhancer> | null = null;
  router: Promise<CaptureVisionRouter> | null = null;
  bShowUiContainer = true;
  bShowImageContainer = false;
  bDisabledBtnEdit = false;
  bDisabledBtnNor = true;
  bShowLoading = true;

  items: Array<any> = [];
  quads: Array<any> = [];
  image: DSImageData | null = null;
  confirmTheBoundary: () => void = () => { };
  normalze: () => void = () => { };

  @ViewChild('imageEditorViewContainerRef') imageEditorViewContainerRef: any;
  @ViewChild('normalizedImageContainerRef') normalizedImageContainerRef: any;
  @ViewChild('cameraViewContainerRef') cameraViewContainerRef: any;

  async ngOnInit(): Promise<void> {
    try {
      const view = await CameraView.createInstance();
      const dce = await (this.cameraEnhancer = CameraEnhancer.createInstance(view));
      const imageEditorView = await ImageEditorView.createInstance();
      /* Creates an image editing layer for drawing found document boundaries. */
      const layer = imageEditorView.createDrawingLayer();

      /**
      * Creates a CaptureVisionRouter instance and configure the task to detect document boundaries.
      * Also, make sure the original image is returned after it has been processed.
      */
      const normalizer = await (this.router = CaptureVisionRouter.createInstance());
      normalizer.setInput(dce as any);
      /**
      * Sets the result types to be returned.
      * Because we need to normalize the original image later, here we set the return result type to
      * include both the quadrilateral and original image data.
      */
      let newSettings = await normalizer.getSimplifiedSettings("DetectDocumentBoundaries_Default");
      newSettings.capturedResultItemTypes |= EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
      await normalizer.updateSettings("DetectDocumentBoundaries_Default", newSettings);
      this.cameraViewContainerRef.nativeElement!.append(view.getUIElement());
      this.imageEditorViewContainerRef.nativeElement!.append(imageEditorView.getUIElement());

      /* Defines the result receiver for the task.*/
      const resultReceiver = new CapturedResultReceiver();
      resultReceiver.onCapturedResultReceived = (result) => {
        const originalImage = result.items.filter((item: CapturedResultItem) => { return item.type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE });
        if (originalImage.length) {
          this.image = (originalImage[0] as OriginalImageResultItem).imageData;
        }
        this.items = result.items.filter((item: CapturedResultItem) => { return item.type === EnumCapturedResultItemType.CRIT_DETECTED_QUAD });
      }
      normalizer.addResultReceiver(resultReceiver);

      this.confirmTheBoundary = () => {
        if (!dce.isOpen() || !this.items.length) return;
        /* Hides the cameraView and shows the imageEditorView. */
        this.bShowUiContainer = false
        this.bShowImageContainer = true;
        /* Draws the image on the imageEditorView first. */
        imageEditorView.setOriginalImage(this.image!);
        this.quads = [];
        /* Draws the document boundary (quad) over the image. */
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE) continue;
          const points = this.items[i].location.points;
          const quad = new QuadDrawingItem({ points });
          this.quads.push(quad);
          layer.addDrawingItems(this.quads);
        }
        this.bDisabledBtnNor = false;
        this.bDisabledBtnEdit = true;
        normalizer.stopCapturing();
      }

      this.normalze = async () => {
        /* Get the selected quadrilateral */
        let seletedItems = imageEditorView.getSelectedDrawingItems();
        let quad;
        if (seletedItems.length) {
          quad = (seletedItems[0] as QuadDrawingItem).getQuad();
        } else {
          quad = this.items[0].location;
        }
        const isPointOverBoundary = (point: Point) => {
          if (point.x < 0 ||
            point.x > this.image!.width ||
            point.y < 0 ||
            point.y > this.image!.height) {
            return true;
          } else {
            return false;
          }
        };
        /* Check if the points beyond the boundaries of the image. */
        if (quad.points.some((point: Point) => isPointOverBoundary(point))) {
          alert("The document boundaries extend beyond the boundaries of the image and cannot be used to normalize the document.");
          return;
        }

        /* Hides the imageEditorView. */
        this.bShowImageContainer = false;
        /* Removes the old normalized image if any. */
        this.normalizedImageContainerRef.nativeElement!.innerHTML = "";
        /**
         * Sets the coordinates of the ROI (region of interest)
         * in the built-in template "normalize-document".
         */
        let newSettings = await normalizer.getSimplifiedSettings("normalize-document") as SimplifiedCaptureVisionSettings;
        newSettings.roiMeasuredInPercentage = false;
        newSettings.roi.points = quad.points;
        await normalizer.updateSettings("normalize-document", newSettings);
        /* Executes the normalization and shows the result on the page */
        let norRes = await normalizer.capture(this.image!, "normalize-document");
        if (norRes.items[0]) {
          this.normalizedImageContainerRef.nativeElement!.append((norRes.items[0] as NormalizedImageResultItem).toCanvas());
        }
        layer.clearDrawingItems();
        this.bDisabledBtnNor = true;
        this.bDisabledBtnEdit = false;
        /* show video view */
        this.bShowUiContainer = true
        view.getUIElement().style.display = "";
        await normalizer.startCapturing("DetectDocumentBoundaries_Default");
      }

      await dce.open();
      /* Uses the built-in template "DetectDocumentBoundaries_Default" to start a continuous boundary detection task. */
      await normalizer.startCapturing("DetectDocumentBoundaries_Default");
      this.bShowLoading = false;
    } catch (ex: any) {
      let errMsg = ex.message || ex;
      console.error(errMsg);
      alert(errMsg);
    }
  }

  async ngOnDestroy() {
    (await this.router)?.dispose();
    (await this.cameraEnhancer)?.dispose();
    console.log('VideoNormalizer Component Unmount');
  }
}
