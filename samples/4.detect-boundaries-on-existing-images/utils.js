export function isMobile(){
    return "ontouchstart" in document.documentElement;
}

export function createFileInput(viewer, router){
    const input = document.createElement("input");
    input.accept = "image/png,image/jpeg,image/bmp";
    input.type = "file";
    input.multiple = true;

    input.addEventListener("change", async () => {
        const { files } = input;
        const len = files.length;
        const sourceArray = [];

        for (let i = 0; i < len; i++) {
            const blob = new Blob([files[i]], {
                type: files[i].type,
            });
            const detectResult = await router.capture(blob, "detect-document-boundaries"); 

            if(detectResult.items.length >0) {
                const quad = [];
                detectResult.items[0].location.points.forEach(p => {
                    quad.push([p.x, p.y]);
                });
                
                sourceArray.push({
                    fileData: blob,
                    extraPageData:[{
                        index: 0,
                        perspectiveQuad: quad
                    }]
                })
            } else {
                sourceArray.push({
                    fileData: blob,
                })
            }
        }

        if(sourceArray.length > 0) {
            viewer.currentDocument.loadSource(sourceArray);
        }

        input.value = null;
        input.files = null;
    },true)

    return input;
}