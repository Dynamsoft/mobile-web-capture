import type { CaptureVisionRouter } from 'dynamsoft-capture-vision-router'
import type { DSImageData } from 'dynamsoft-core'
import type { DocumentDetectConfig, Quad, VImageData } from 'dynamsoft-document-viewer'

export async function initDocDetectModule(DDV: any, router: CaptureVisionRouter) {
  class DDNNormalizeHandler extends DDV.DocumentDetect {
    async detect(image: VImageData, config: DocumentDetectConfig) {
      if (!router) {
        return Promise.resolve({
          success: false
        })
      }

      let width: number = image.width as number;
      let height: number = image.height as number;
      let ratio = 1;
      let data: ArrayBuffer;

      if (height > 720) {
        ratio = height / 720;
        height = 720;
        width = Math.floor(width / ratio);
        data = compress(image.data, image.width as any, image.height as any, width, height);
      } else {
        data = image.data.slice(0) as ArrayBuffer;
      }

      // Define DSImage according to the usage of DDN
      const DSImage = {
        bytes: new Uint8Array(data),
        width,
        height,
        stride: width * 4, //RGBA
        format: 10 // IPF_ABGR_8888
      } as DSImageData

      // Use DDN normalized module
      const results = await router.capture(DSImage, 'detect-document-boundaries')

      // Filter the results and generate corresponding return values."
      if (results.items.length <= 0) {
        return Promise.resolve({
          success: false
        })
      }

      const quad: Quad = [] as any
      (results.items[0] as any).location.points.forEach((p: { x: number; y: number }) => {
        quad.push([p.x * ratio, p.y * ratio])
      })

      const detectResult = this['processDetectResult']({
        location: quad,
        width: image.width,
        height: image.height,
        config
      })

      return Promise.resolve(detectResult)
    }
  }

  DDV.setProcessingHandler('documentBoundariesDetect', new DDNNormalizeHandler());
}

function compress(
  imageData: any,
  imageWidth: number,
  imageHeight: number,
  newWidth: number,
  newHeight: number,
) {
  let source: any = null;
  try {
      source = new Uint8ClampedArray(imageData);
  } catch (error) {
      source = new Uint8Array(imageData);
  }

  const scaleW = newWidth / imageWidth;
  const scaleH = newHeight / imageHeight;
  const targetSize = newWidth * newHeight * 4;
  const targetMemory = new ArrayBuffer(targetSize);
  let distData = null;

  try {
      distData = new Uint8ClampedArray(targetMemory, 0, targetSize);
  } catch (error) {
      distData = new Uint8Array(targetMemory, 0, targetSize);
  }

  const filter = (distCol: any, distRow: any) => {
      const srcCol = Math.min(imageWidth - 1, distCol / scaleW);
      const srcRow = Math.min(imageHeight - 1, distRow / scaleH);
      const intCol = Math.floor(srcCol);
      const intRow = Math.floor(srcRow);

      let distI = (distRow * newWidth) + distCol;
      let srcI = (intRow * imageWidth) + intCol;

      distI *= 4;
      srcI *= 4;

      for (let j = 0; j <= 3; j += 1) {
          distData[distI + j] = source[srcI + j];
      }
  };

  for (let col = 0; col < newWidth; col += 1) {
      for (let row = 0; row < newHeight; row += 1) {
          filter(col, row);
      }
  }

  return distData;
}
