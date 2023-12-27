<script setup lang="ts">
import { CaptureVisionRouter, LicenseManager } from 'dynamsoft-capture-vision-router'
import { initDocDetectModule } from './initDocDetectModule'
import { onMounted, watch } from 'vue'
import { DDV } from 'dynamsoft-document-viewer'
import 'dynamsoft-document-viewer/dist/ddv.css'

const props = defineProps({
  showCaptureViewer: Boolean
})
const emit = defineEmits(['switchVisibility', 'setImages'])

onMounted(async () => {
  await DDV.setConfig({
    license:
      'f0099mgAAAJ6zGNMjgq6hDnJnu0i63Wy3J35NFlD8WG1Ra7Qi3xh/QODuqGye7KiY5zMiptUuQhk5x79YUkETGgUUGTTi0RQ+umEUIDgBkYENYvAGNQSn9Wu6v9vko+ee8QDJ5yED',
    // The wasm path needs to be changed to the CDN.
    engineResourcePath: 'https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@latest/dist/engine'
  })

  DDV.on("error", (e) => {
      alert(e.message)
  })

  LicenseManager.initLicense(
    'DLS2eyJoYW5kc2hha2VDb2RlIjoiMjM0ODEwLVRYbFhaV0pRY205cSIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMjM0ODEwIiwic3RhbmRieVNlcnZlclVSTCI6Imh0dHBzOi8vc2x0cy5keW5hbXNvZnQuY29tIiwiY2hlY2tDb2RlIjotMjA0MzA5ODk1NH0='
  )
  CaptureVisionRouter.engineResourcePath =
    'https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.0.11/dist/'
  CaptureVisionRouter.preloadModule(['DDN'])

  const router = await CaptureVisionRouter.createInstance()
  await initDocDetectModule(DDV, router)

  const captureViewer = new DDV.CaptureViewer({
    container: 'viewerContainer',
    viewerConfig: {
      acceptedPolygonConfidence: 60,
      enableAutoCapture: true,
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
    });
    emit('switchVisibility', false)
  })

  watch(
    () => props.showCaptureViewer,
    (newValue) => {
      if (newValue === true) {
        (captureViewer.currentDocument as any).deleteAllPages();
        captureViewer.play()
      } else {
        captureViewer.stop();
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
