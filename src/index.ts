import MobileWebCapture from "./MobileWebCapture";
import { LibraryView } from "./views/LibraryView";
import { DocumentView } from "./views/DocumentView";
import { PageView } from "./views/PageView";
import { TransferView } from "./views/TransferView";

export const MWC = {
  MobileWebCapture,
  LibraryView,
  DocumentView,
  PageView,
  TransferView,
};

export type { UploadedDocument, ExportConfig, UploadStatus, EnumMWCViews, EnumAllViews } from "./views/utils/types";
export type { MobileWebCaptureConfig } from "./MobileWebCapture";
export type { LibraryViewConfig } from "./views/LibraryView";
export type { PageViewConfig } from "./views/PageView";
export type { DocumentViewConfig } from "./views/DocumentView";
export type { TransferViewConfig } from "./views/TransferView";

export { MobileWebCapture, LibraryView, DocumentView, PageView, TransferView };

export default MWC;
