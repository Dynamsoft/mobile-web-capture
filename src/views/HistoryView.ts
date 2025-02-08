import MWCView, { EmptyContentConfig, ToolbarButtonConfig } from "./components/ViewCreator";
import { MWC_ICONS } from "./utils/icons";
import { createStyle } from "./utils";
import { DocumentHistoryItem } from "./components/DocumentHistoryItem";
import { EnumMWCViews, ExportConfig, UploadedDocument } from "./utils/types";
import { ModalVariant, showToast } from "./components/Modal";

export type HistoryCallerView = EnumMWCViews.Document | EnumMWCViews.Library | EnumMWCViews.Page;

export interface HistoryToolbarButtonsConfig {
  back?: ToolbarButtonConfig;
}

type HistoryToolbarButtons = Record<keyof HistoryToolbarButtonsConfig, HTMLElement>;

export interface HistoryViewConfig {
  container?: HTMLElement;

  exportConfig?: ExportConfig;
  getUploadedDocuments?: () => UploadedDocument[];
  updateUploadedDocuments?: (files: UploadedDocument[]) => void;

  onBack?: (caller: HistoryCallerView) => void;

  // For Public
  emptyContentConfig?: EmptyContentConfig;
  toolbarButtonsConfig?: HistoryToolbarButtonsConfig;
}

export class HistoryView extends MWCView {
  private currentCaller: HistoryCallerView = EnumMWCViews.Library;
  private toolbarBtn: HistoryToolbarButtons = {
    back: null,
  };

  constructor(protected config: HistoryViewConfig) {
    super(config);
  }

  initialize() {
    createStyle("mwc-history-view-style", HISTORY_VUEW_STYLE);

    super.initialize();
    this.updateEmptyContentHTML();
    this.setVisible(false);
  }

  setVisible(visible: boolean, config?: { caller: HistoryCallerView }) {
    super.setVisible(visible);

    if (visible) {
      this.currentCaller = config.caller;

      this.showContent(!!this.config.getUploadedDocuments()?.length);
      this.loadUploadedFiles();
    }
  }

  protected createHeader(): void {
    super.createHeader();

    this.MWCViewElements.headerContainer.innerHTML = `
      <div class="mwc-view-header-title">Upload History</div>
    `;
  }

  protected updateEmptyContentHTML() {
    const DEFAULT_EMPTY_HISTORY_VIEW = `
    <div class="mwc-default-empty-history">
      ${MWC_ICONS.emptyLibrary}
      <div class="title">
        No uploaded files found!
      </div>
    </div>
    `;

    super.setEmptyContent(this.config.emptyContentConfig || DEFAULT_EMPTY_HISTORY_VIEW);
  }

  protected createToolbars(): void {
    super.createToolbars();

    const { toolbarButtonsConfig } = this.config;

    const buttons = [
      null,
      null,
      null,
      {
        id: "mwc-history-back",
        icon: toolbarButtonsConfig?.back?.icon || MWC_ICONS.back,
        label: toolbarButtonsConfig?.back?.label || "Back",
        className: toolbarButtonsConfig?.back?.className || "",
        isHidden: toolbarButtonsConfig?.back?.isHidden,
        onClick: () => this.config.onBack?.(this.currentCaller),
      },
    ];

    buttons.forEach((btn) => {
      const btnElement = this.createToolbarButton(btn);
      if (btn) {
        this.toolbarBtn[btn.id.split("-").pop() as keyof HistoryToolbarButtons] = btnElement;
      }
      this.MWCViewElements.toolbarContainer.appendChild(btnElement);
    });
  }

  private loadUploadedFiles() {
    // Reset content container
    this.MWCViewElements.contentContainer.textContent = "";

    this.config.getUploadedDocuments()?.forEach((file) => {
      const historyItem = new DocumentHistoryItem({
        container: this.config.container,
        doc: file,
        onDeleteDocument: () => this.handleHistoryDelete(file),
        onDownloadDocument: () => this.handleHistoryDownload(file),
      });

      this.MWCViewElements.contentContainer.append(historyItem.getDom());
    });
  }

  private handleHistoryDelete(doc: UploadedDocument) {
    if (doc) {
      this.config?.exportConfig
        ?.deleteFromServer(doc)
        .then(async () => {
          const newList = this.config.getUploadedDocuments()?.filter((file) => file.uploadTime !== doc.uploadTime);
          this.config.updateUploadedDocuments(newList);

          this.showContent(!!this.config.getUploadedDocuments()?.length);
          await showToast(this.config.container, "Deleted", ModalVariant.SUCCESS);
        })
        .catch(async () => {
          await showToast(this.config.container, "Failed", ModalVariant.ERROR);
        });
    }
  }

  private handleHistoryDownload(doc: UploadedDocument) {
    this.config?.exportConfig
      ?.downloadFromServer(doc)
      .then(async () => {
        await showToast(this.config.container, "Downloaded", ModalVariant.SUCCESS);
      })
      .catch(async () => {
        await showToast(this.config.container, "Failed", ModalVariant.ERROR);
      });
  }

  dispose() {
    if (this.config.container) {
      this.config.container.style.display = "none";
      this.MWCViewElements.contentContainer.textContent = "";
    }
  }
}

const HISTORY_VUEW_STYLE = `
  .mwc-default-empty-history {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .mwc-default-empty-history svg {
    width: 200px;
    height: auto;
  }

  .mwc-default-empty-history .title {
    margin-top: 2rem;
    font-size: 24px;
        color: black;
  }

  .mwc-default-empty-history .desc {
    font-size: 16px;
        color: black;
  }
`;
