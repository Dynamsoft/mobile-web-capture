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

export function startLoading(text){
    const loadingBar = document.createElement('div');
    loadingBar.className = "mwc-loading-bar";

    loadingBar.innerHTML = [
        `<div class='loader'></div>`,
        `<span id='mwcLoadingText'>${text}</span>`
    ].join('')

    document.body.appendChild(loadingBar);
}

export function updateLoadingText(text){
    const loadingText = document.getElementById("mwcLoadingText");

    if(loadingText){
        loadingText.innerHTML = text;
    }
}

export function stopLoading(){
    const loadingBar = document.getElementsByClassName("mwc-loading-bar");

    if(loadingBar.length > 0){
        loadingBar[0].remove();
    }
}