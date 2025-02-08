import { UploadedDocument } from "../utils/types";
import { createStyle, formatTicks } from "../utils";
import { ModalType, ModalVariant, showModal, showToast } from "../components/Modal";

export interface DocumentHistoryItemConfig {
  container: HTMLElement;
  doc: UploadedDocument;
  onDeleteDocument: (doc: UploadedDocument) => void;
  onDownloadDocument: (doc: UploadedDocument) => void;
}

export class DocumentHistoryItem {
  private dom: HTMLElement;

  constructor(private config: DocumentHistoryItemConfig) {
    this.createUI();
    this.bindEvents();
  }

  private createUI() {
    createStyle("mwc-history-item-style", DEFAULT_HISTORY_ITEM_STYLE);

    this.dom = document.createElement("div");
    this.dom.className = "mwc-library-view-history-item";
    this.dom.innerHTML = `
      <div class="mwc-library-view-history-name">${this.config.doc.fileName}</div>
      <div class="mwc-library-view-history-time">${formatTicks(this.config.doc.uploadTime) || ""}</div>
      <div class="mwc-library-view-history-actions">
        <button class="mwc-library-view-history-action-btn delete">Delete</button>
        <span class="mwc-library-view-history-separator">|</span>
        <button class="mwc-library-view-history-action-btn download">Download</button>
      </div>
    `;
  }

  private bindEvents() {
    const deleteBtn = this.dom.querySelector(".delete");
    const downloadBtn = this.dom.querySelector(".download");

    deleteBtn?.addEventListener("click", () => this.handleDelete());
    downloadBtn?.addEventListener("click", () => this.handleDownload());
  }

  private async handleDelete() {
    const confirmed = await showModal({
      container: this.config.container, // Assuming modal can work with document.body
      type: ModalType.CONFIRM,
      variant: ModalVariant.WARNING,
      title: "Delete Document",
      message: "Are you sure you want to delete this document from the server?",
      confirmText: "Delete",
      cancelText: "Cancel",
      showCloseBtn: true,
    });

    if (confirmed) {
      await this.config?.onDeleteDocument?.(this.config.doc);

      this.dispose();

      await showToast(this.config.container, "Deleted", ModalVariant.SUCCESS);
    }
  }

  private async handleDownload() {
    await this.config?.onDownloadDocument?.(this.config.doc);
  }

  getDom() {
    return this.dom;
  }

  dispose() {
    this.dom.remove();
  }
}

const DEFAULT_HISTORY_ITEM_STYLE = `
.mwc-library-view-history-item {
  display: flex;
  flex-direction: column;
  font-family: Verdana;
  padding: 16px;
  border-bottom: 1px solid #F5F5F5;
}

.mwc-library-view-history-item:last-child {
  border-bottom: none;
}

.mwc-library-view-history-name {
  font-size: 16px;
}

.mwc-library-view-history-time {
  color: #888888;
  font-size: 16px;
}

.mwc-library-view-history-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mwc-library-view-history-action-btn {
  color: #FE8E14;
  cursor: pointer;
  background: none;
  border: none;
  font-family: Verdana;
  padding: 0;
  font-size: 16px;
}

.mwc-library-view-history-action-btn:hover {
  text-decoration: underline;
}

.mwc-library-view-history-separator {
  color: #E0E0E0;
}
`;
