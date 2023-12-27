<script setup lang="ts">
import { reactive, ref } from 'vue'
import CaptureViewer from './Component/CaptureViewer.vue'
import ImageContainer from './Component/ImageContainer.vue'

const showCaptureViewer = ref(true)
const images = reactive({
  originalImage: '',
  detectedImage: ''
})

const switchVisibility = (value: boolean) => {
  showCaptureViewer.value = value
}
const setImages = (value: { originalImage: string; detectedImage: string }) => {
  const { originalImage, detectedImage } = value
  images.originalImage = originalImage
  images.detectedImage = detectedImage
}
</script>

<template>
  <CaptureViewer
    :showCaptureViewer="showCaptureViewer"
    @switchVisibility="switchVisibility"
    @setImages="setImages"
  ></CaptureViewer>
  <ImageContainer
    :showCaptureViewer="showCaptureViewer"
    :images="images"
    @switchVisibility="switchVisibility"
  ></ImageContainer>
</template>

<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0 0;
  padding: 0 0;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
