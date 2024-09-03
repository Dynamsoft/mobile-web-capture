<script setup lang="ts">
import { type NormalizedImageResultItem } from "dynamsoft-document-normalizer";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { onMounted, onUnmounted, ref, type Ref } from "vue";

const iptRef: Ref<HTMLInputElement | null> = ref(null);
const elInr: Ref<HTMLDivElement | null> = ref(null);
const router: Ref<Promise<CaptureVisionRouter> | null> = ref(null);

onMounted(() => {
    router.value = CaptureVisionRouter.createInstance();
})

onUnmounted(async () => {
    (await router.value)?.dispose();
    console.log('ImageNormalizer Component Unmount');
})

const captureImg = async (e: any) => {
    try {
        elInr.value!.innerHTML = "";
        const normalizer = await router.value;
        const results = await normalizer!.capture(e.target.files[0], "DetectAndNormalizeDocument_Default");
        if(results.items.length) {
            const cvs = (results.items[0] as NormalizedImageResultItem).toCanvas();
            if (document.body.clientWidth < 600) {
                cvs.style.width = "90%";
            }
            elInr.value!.append(cvs);
        }
        console.log(results);
    } catch (ex: any) {
        let errMsg = ex.message || ex;
        console.error(errMsg);
        alert(errMsg);
    }
}
</script>

<template>
    <div class="recognize-img">
        <div class="img-ipt"><input type="file" ref="iptRef" @change="captureImg" /></div>
    </div>
    <div class="img-normalized-result" ref="elInr"></div>
</template>
    
<style scoped>
.recognize-img {
    width: 100%;
    height: 100%;
    font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
}

.recognize-img .img-ipt {
    width: 80%;
    height: 100%;
    display: flex;
    justify-content: center;
    border: 1px solid black;
    margin: 0 auto;
}
</style>