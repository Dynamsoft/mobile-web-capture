import { DDV } from "dynamsoft-document-viewer";
import { TransferItem } from "./components/TransferItem";
import { MWC_ICONS } from "./utils/icons";
import MWCView, { ToolbarButtonConfig } from "./components/ViewCreator";
import { createStyle } from "./utils";

export enum TransferMode {
  Copy = "copy",
  Move = "move",
}

export interface TransferToolbarButtonsConfig {
  cancel?: ToolbarButtonConfig;
  action?: ToolbarButtonConfig;
}

type TransferToolbarButtons = Record<keyof TransferToolbarButtonsConfig, HTMLElement>;

export interface TransferViewConfig {
  container?: HTMLElement;
  onConfirmTransfer?: (mode: TransferMode) => void;
  onCancelTransfer?: () => void;

  // For Public
  toolbarButtonsConfig?: TransferToolbarButtons;
}

export class TransferView extends MWCView {
  private transferMode: TransferMode = TransferMode.Copy;
  private checkedDocUids: string[] = [];
  private docItems: TransferItem[] = [];

  private toolbarBtn: TransferToolbarButtons = {
    action: null,
    cancel: null,
  };
  private headerTitle: HTMLElement = null;

  constructor(protected config: TransferViewConfig) {
    super(config);
  }

  initialize() {
    super.initialize();

    createStyle("mwc-transfer-view-style", TRANSFER_VIEW_STYLE);
    this.updateEmptyContentHTML();

    this.setVisible(false);
  }

  protected createHeader(): void {
    super.createHeader();
    this.MWCViewElements.headerContainer.innerHTML = `
      <div class="mwc-transfer-view-header-title">Transfer Page</div>
    `;
    this.headerTitle = this.MWCViewElements.headerContainer.querySelector(".mwc-transfer-view-header-title");
  }

  protected createContent(): void {
    this.MWCViewElements.contentContainer = document.createElement("div");
    this.MWCViewElements.contentContainer.className = "mwc-view-content";
    this.config.container.appendChild(this.MWCViewElements.contentContainer);
  }

  protected updateEmptyContentHTML(): void {
    const DEFAULT_EMPTY_TRANSFER_VIEW = `
      <div class="title">
        No other documents to move the pages!
      </div>
      <div class="desc">
        Please create another document!
      </div>
    `;
    this.MWCViewElements.emptyContentContainer.innerHTML = DEFAULT_EMPTY_TRANSFER_VIEW;
  }

  protected createToolbars(): void {
    super.createToolbars();

    // Create toolbar buttons
    const buttons = [
      {
        id: "mwc-transfer-cancel",
        icon: MWC_ICONS.back,
        label: "Cancel",
        onClick: () => this.handleCancelButton(),
      },
      {
        id: "mwc-transfer-action",
        icon: MWC_ICONS.done,
        label: "Action",
        className: "action-btn",
        onClick: () => {}, // Set dynamically in setVisible
      },
    ];

    buttons.forEach((btn) => {
      const btnElement = this.createToolbarButton(btn);
      if (btn.id === "mwc-transfer-cancel") {
        this.toolbarBtn.cancel = btnElement;
      } else if (btn.id === "mwc-transfer-action") {
        this.toolbarBtn.action = btnElement;
      }
      this.MWCViewElements.toolbarContainer.appendChild(btnElement);
    });
  }

  private updateHeaderAndAction() {
    switch (this.transferMode) {
      case TransferMode.Copy:
        this.headerTitle.textContent = "Copy Selected Pages to";
        this.toolbarBtn.action.children[1].textContent = "Paste";
        break;
      case TransferMode.Move:
        this.headerTitle.textContent = "Move Selected Pages to";
        this.toolbarBtn.action.children[1].textContent = "Confirm";
        break;
    }
  }

  setVisible(visible: boolean, config?: { mode: TransferMode; docId: string; selectedIdx: number[] }): void {
    super.setVisible(visible);

    if (visible && config) {
      this.MWCViewElements.contentContainer.textContent = "";
      this.transferMode = config.mode;

      this.updateHeaderAndAction();
      this.updateToolbarStyle();

      this.toolbarBtn.action.onclick = () => this.handleActionClick(config.docId, config.selectedIdx);

      const docs = DDV.documentManager
        .getAllDocuments()
        .filter((doc) => (this.transferMode === TransferMode.Move ? doc.uid !== config.docId : true));

      const hasContent = docs.length > 0;
      this.showContent(hasContent);

      if (hasContent) {
        this.loadDocuments(docs);
      }
    }
  }

  private loadDocuments(docs: any[]): void {
    docs.forEach((doc) => {
      const docItem = new TransferItem({
        docId: doc.uid,
        onCheckedChange: (docId, checked) => this.handleDocumentChecked(docId, checked),
      });

      this.docItems.unshift(docItem);

      if (this.MWCViewElements.contentContainer.firstChild) {
        this.MWCViewElements.contentContainer.insertBefore(
          docItem.getDom(),
          this.MWCViewElements.contentContainer.firstChild
        );
      } else {
        this.MWCViewElements.contentContainer.appendChild(docItem.getDom());
      }
    });
  }

  private handleDocumentChecked(docId: string, checked: boolean): void {
    if (checked) {
      this.checkedDocUids.push(docId);
    } else {
      this.checkedDocUids = this.checkedDocUids?.filter((uid) => uid !== docId);
    }
    this.updateToolbarStyle();
  }

  private updateToolbarStyle(): void {
    const isDisabled =
      this.transferMode === TransferMode.Move ? this.checkedDocUids.length !== 1 : this.checkedDocUids.length < 1;
    this.toolbarBtn.action.classList.toggle("disabled", isDisabled);
  }

  private handleCancelButton(): void {
    this.checkedDocUids = [];
    this.docItems.forEach((item) => {
      item.toggleCheck(false);
      item.dispose();
    });
    this.docItems = [];
    this.config.onCancelTransfer?.();
  }

  private handleActionClick(sourceDocId: string, sourceSelectedIdx: number[]): void {
    if (this.toolbarBtn.action.classList.contains("disabled")) return;

    if (this.transferMode === TransferMode.Copy) {
      this.checkedDocUids.forEach((docId) => {
        DDV.documentManager.copyPagesToDocument(sourceDocId, docId, {
          sourceIndices: [...sourceSelectedIdx],
        });
      });
    } else if (this.transferMode === TransferMode.Move) {
      DDV.documentManager.movePagesToDocument(sourceDocId, this.checkedDocUids[0], {
        sourceIndices: [...sourceSelectedIdx],
      });
    }

    this.config.onConfirmTransfer?.(this.transferMode);
    this.handleCancelButton();
  }

  dispose() {
    this.docItems.forEach((item) => item.dispose());
    this.docItems = [];
    this.checkedDocUids = [];

    if (this.config.container) {
      this.config.container.style.display = "none";
    }
  }
}

const TRANSFER_VIEW_STYLE = `
  .mwc-view-controls-btn.action-btn .label {
    color: #fe8e14;
  }
`;
