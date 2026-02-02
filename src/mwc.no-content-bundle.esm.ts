// For framework like vue/react,
// the package is only a empty shell,
// relink directly to specific packages.

export * as Core from "dynamsoft-core";
export * from "dynamsoft-document-scanner";
export * from "dynamsoft-document-viewer";
export { _getNorImageData, _saveToFile, _toBlob, _toCanvas, _toImage } from "dynamsoft-core";
export { PlayCallbackInfo, Point, Rect, VideoDeviceInfo } from "dynamsoft-document-viewer";
export * from "./index";
