// For framework like vue/react,
// the package is only a empty shell,
// relink directly to specific packages.

export * from "dynamsoft-core";
export * from "dynamsoft-license";
export * from "dynamsoft-capture-vision-router";
export * from "dynamsoft-camera-enhancer";
export * from "dynamsoft-document-normalizer";
export * from "dynamsoft-utility";
export * from "dynamsoft-document-scanner";
export * from "dynamsoft-document-viewer";
export { _getNorImageData, _saveToFile, _toBlob, _toCanvas, _toImage } from "dynamsoft-core";
export { NormalizedImageResultItem } from "dynamsoft-document-normalizer";
export { PlayCallbackInfo, Point, Rect, VideoDeviceInfo } from "dynamsoft-document-viewer";
export * from "./index";
