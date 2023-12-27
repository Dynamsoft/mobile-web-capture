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

      // Define DSImage according to the usage of DDN.
      const DSImage = {
        bytes: new Uint8Array(image.data.slice(0) as ArrayBuffer),
        width: image.width,
        height: image.height,
        stride: (image.width as number) * 4, //RGBA
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
      ;(results.items[0] as any).location.points.forEach((p: { x: number; y: number }) => {
        quad.push([p.x, p.y])
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

  DDV.setProcessingHandler('documentBoundariesDetect', new DDNNormalizeHandler())
}
