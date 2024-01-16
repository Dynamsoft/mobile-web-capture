<script setup lang="ts">
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router"
import { initDocDetectModule } from './initDocDetectModule'
import { onMounted, watch } from 'vue'
import { DDV } from 'dynamsoft-document-viewer'
import { CoreModule } from "dynamsoft-core"
import { LicenseManager } from "dynamsoft-license"
import 'dynamsoft-document-viewer/dist/ddv.css'
import 'dynamsoft-document-normalizer';

const props = defineProps({
  showCaptureViewer: Boolean
})
const emit = defineEmits(['switchVisibility', 'setImages'])

onMounted(async () => {
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

  await LicenseManager.initLicense('DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTEwMjQ5NjE5NyJ9', true)
  await DDV.Core.init()

  const router = await CaptureVisionRouter.createInstance()
  await initDocDetectModule(DDV, router)

  const captureViewer = new DDV.CaptureViewer({
    container: 'viewerContainer',
    viewerConfig: {
      acceptedPolygonConfidence: 60,
      enableAutoDetect: true
    }
  })

  captureViewer.play({
    resolution: [1920, 1080]
  })

  captureViewer.on('captured', async (e) => {
    const pageData = (await (captureViewer.currentDocument as any).getPageData(e.pageUid)) as any
    emit('setImages', {
      originalImage: URL.createObjectURL(pageData.raw.data),
      detectedImage: URL.createObjectURL(pageData.display.data)
    })
    emit('switchVisibility', false)
  })

  watch(
    () => props.showCaptureViewer,
    (newValue) => {
      if (newValue === true) {
        captureViewer.currentDocument?.deleteAllPages();
        captureViewer.play()
      } else {
        captureViewer.stop()
      }
    }
  )
})
</script>

<template>
  <div v-show="showCaptureViewer" id="viewerContainer"></div>
</template>

<style scoped>
#viewerContainer {
  width: 100%;
  height: 100%;
}
</style>
