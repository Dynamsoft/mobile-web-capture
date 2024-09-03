import { useEffect, useRef, MutableRefObject, ChangeEvent } from "react";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { NormalizedImageResultItem } from "dynamsoft-document-normalizer";
import "./ImageNormalizer.css";

function ImageNormalizer() {
    const iptRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const elInr: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const router: MutableRefObject<Promise<CaptureVisionRouter> | null> = useRef(null);

    useEffect((): any => {
        router.current = CaptureVisionRouter.createInstance();

        return async () => {
            (await router.current)?.dispose();
            console.log('ImageNormalizer Component Unmount');
        }
    }, []);

    const captureImg = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            elInr.current!.innerHTML = "";
            const normalizer = await router.current;
            const results = await normalizer!.capture(e.target.files![0], "DetectAndNormalizeDocument_Default");
            if (results.items.length) {
                const cvs = (results.items[0] as NormalizedImageResultItem).toCanvas();
                if (document.body.clientWidth < 600) {
                    cvs.style.width = "90%";
                }
                elInr.current!.append(cvs);
            }
            console.log(results);
        } catch (ex: any) {
            let errMsg = ex.message || ex;
            console.error(errMsg);
            alert(errMsg);
        }
    }

    return (
        <div className="recognize-img">
            <div className="img-ipt"><input type="file" ref={iptRef} onChange={captureImg} /></div>
            <div className="result-area" ref={elInr}></div>
        </div>
    )
}

export default ImageNormalizer;