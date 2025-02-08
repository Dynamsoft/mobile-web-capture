// Common types
export enum EnumMWCViews {
  Library = "library",
  Page = "page",
  Document = "document",
  Transfer = "transfer",
  History = "history",
}

export type EnumMWCStartingViews = EnumMWCViews.Library | EnumMWCViews.Document;

export enum EnumAllViews {
  Library = "library",
  Page = "page",
  Document = "document",
  Transfer = "transfer",
  History = "history",
  Scanner = "scanner",
  Correction = "correction",
  ScanResult = "scan-result",
}

export type UploadStatus = "success" | "failed";

export type UploadedDocument = {
  fileName: string;
  downloadUrl: string;
  status: UploadStatus;
  uploadTime?: string;
};

export interface ExportConfig {
  uploadToServer?: (fileName: string, blob: Blob) => Promise<void | UploadedDocument>;
  downloadFromServer?: (doc: UploadedDocument) => Promise<void>;
  deleteFromServer?: (doc: UploadedDocument) => Promise<void>;
  // Return true if it should close MWC after uploading, false if not
  onUploadSuccess?: (fileName: string, fileType: string, view: EnumMWCViews, blob: Blob) => Promise<boolean>;
}
