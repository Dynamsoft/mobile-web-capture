export function isMobile(){
    return "ontouchstart" in document.documentElement;
}

export async function initDocDetectModule(DDV, CVR){
    const router = await CVR.CaptureVisionRouter.createInstance();

    class DDNNormalizeHandler extends DDV.DocumentDetect {
        async detect(image, config) {
            if(!router) {
                return Promise.resolve({
                    success: false,
                });
            }

            // Define DSImage according to the usage of DDN.
            const DSImage = {
                bytes: new Uint8Array(image.data.slice(0)),
                width: image.width,
                height: image.height,
                stride: image.width * 4 ,//RGBA
                format: 10 ,// IPF_ABGR_8888
            };

            // Use DDN normalized module
            const results = await router.capture(DSImage, "detect-document-boundaries");

             // Filter the results and generate corresponding return values."
             if (results.items.length <= 0) {
                return Promise.resolve({
                    success: false,
                });
            }

            const quad = [];
            results.items[0].location.points.forEach(p => {
                quad.push([p.x, p.y]);
            });

            const detectResult = this.processDetectResult({
                location:quad,
                width:image.width,
                height:image.height,
                config,
            });

            return Promise.resolve(detectResult);
        }
    }

    DDV.setProcessingHandler("documentBoundariesDetect", new DDNNormalizeHandler());
}