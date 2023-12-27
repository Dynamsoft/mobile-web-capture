<script setup lang="ts">
defineProps({
  showCaptureViewer: Boolean,
  images: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['switchVisibility'])
const restore = () => {
  emit('switchVisibility', true)
}
</script>

<template>
  <div v-show="!showCaptureViewer" class="image-container">
    <div class="restore-button" @click="restore">Restore</div>
    <span>Original Image:</span>
    <img :src="images.originalImage" />
    <span>Normalized Image:</span>
    <img :src="images.detectedImage" />
  </div>
</template>

<style scoped>
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  box-sizing: border-box;
  align-items: center;
  flex-direction: column;
  padding: 10px 0px;
}

.image-container img {
  width: 80%;
  height: 40%;
  object-fit: contain;
  border: none;
}

.restore-button {
  display: flex;
  width: 80px;
  height: 40px;
  align-items: center;
  background: #fe8e14;
  justify-content: center;
  color: white;
  cursor: pointer;
  user-select: none;
}
</style>
