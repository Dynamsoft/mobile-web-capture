<script setup lang="ts">
import { ref, type Ref } from "vue";
import vueLogo from "./assets/logo.svg";
import VideoNormalizer from "./components/VideoNormalizer.vue";
import ImageNormalizer from "./components/ImageNormalizer.vue";

const mode: Ref<string> = ref("video");
</script>

<template>
  <div class='App'>
    <div class='title'>
      <h2 class='title-text'>Hello World for Vue</h2>
      <img class='title-logo' :src="vueLogo" alt="logo" />
    </div>
    <div class='top-btns'>
      <button @click="mode = 'video'" :style="{ backgroundColor: mode === 'video' ? 'rgb(255, 174, 55)' : '#FFFFFF' }">VideoNormalizer</button>
      <button @click="mode = 'image'" :style="{ backgroundColor: mode === 'image' ? 'rgb(255, 174, 55)' : '#FFFFFF' }">ImageNormalizer</button>
    </div>
    <VideoNormalizer v-if="mode === 'video'"/> 
    <ImageNormalizer v-else/>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}
.title .title-logo {
  width: 30px;
  height: 30px;
  margin-left: 10px;
}

.top-btns {
  width: 100%;
  margin: 20px auto;
}

.top-btns button {
  display: inline-block;
  border: 1px solid black;
  padding: 5px 15px;
  background-color: transparent;
  cursor: pointer;
}

.top-btns button:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right: transparent;
}
.top-btns button:nth-child(2) {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: transparent;
}
</style>
