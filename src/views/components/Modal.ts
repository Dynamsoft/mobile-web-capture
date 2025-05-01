import { MWC_ICONS } from "../utils/icons";

export enum ModalType {
  CONFIRM = "confirm",
  INPUT = "input",
  TOAST = "toast",
}

export enum ModalVariant {
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

const ICONS = {
  [ModalVariant.WARNING]: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor" class="modal-icon warning">
  <path width="24" height="24" fill="currentColor"
    d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1120-20 20 20 0 01-20 20zm21.72-201.15l-5.74 122a16 16 0 01-32 0l-5.74-121.94v-.05a21.74 21.74 0 1143.44 0z" />
</svg>
  `,
  [ModalVariant.ERROR]: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="modal-icon error">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
  [ModalVariant.SUCCESS]: `
  <svg id="selected-circle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="modal-icon " width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <clipPath id="selected-circleclip-path">
      <rect id="Rectangle_2751" data-name="Rectangle 2751" width="24" height="24" fill="none"/>
    </clipPath>
  </defs>
  <g id="Group_547" data-name="Group 547" clip-path="url(#selected-circleclip-path)">
    <path id="Path_1478" data-name="Path 1478" d="M24,12A12,12,0,1,1,12,0,12,12,0,0,1,24,12" fill="#fe8e14"/>
    <path id="Path_1479" data-name="Path 1479" d="M10.52,17.174a2.517,2.517,0,0,1-1.757-.725L5.757,13.442a1,1,0,0,1,1.414-1.414l3,3a.49.49,0,0,0,.387.144.511.511,0,0,0,.373-.2l5.8-7.742a1,1,0,0,1,1.6,1.2l-5.81,7.748a2.514,2.514,0,0,1-1.83.994c-.059,0-.117.006-.176.006" fill="#fff"/>
  </g>
</svg>`,
};

export async function showToast(
  container: HTMLElement,
  title: string,
  variant = ModalVariant.SUCCESS,
  duration = 1500
) {
  return await showModal({
    container,
    type: ModalType.TOAST,
    title,
    variant,
    duration,
  });
}

export interface ModalConfig {
  container: HTMLElement;
  type?: ModalType;
  variant?: ModalVariant;
  title?: string;
  message?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  validation?: (value: string) => string | null; // Return error message or null if valid
  duration?: number;
  showCloseBtn?: boolean;
}

export function showModal({
  container,
  type = ModalType.CONFIRM,
  variant = ModalVariant.SUCCESS,
  title,
  message,
  placeholder,
  initialValue = "",
  confirmText = "OK",
  cancelText = "CANCEL",
  validation,
  duration,
  showCloseBtn,
}: ModalConfig): Promise<string | boolean | null> {
  // Add styles if not already present
  if (!document.getElementById("modal-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "modal-styles";
    styleSheet.textContent = MODAL_STYLES;
    document.head.appendChild(styleSheet);
  }

  const originalPosition = container.style.position;
  if (!container.style.position) {
    container.style.position = "relative";
  }

  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-overlay";

  const inputSection =
    type === ModalType.INPUT
      ? `
        <div class="modal-input-container">
          <input 
            type="text" 
            class="modal-input" 
            placeholder="${placeholder || ""}"
            value="${initialValue}"
            maxlength="100"
          >
          <div class="modal-error"></div>
        </div>
        `
      : "";
  const messageSection = message
    ? `
      <div class="modal-message">
        ${message}
      </div>
      `
    : "";

  if (type === ModalType.TOAST) {
    modalContainer.classList.add("toast");
    modalContainer.innerHTML = `
        <div class="modal-toast">
          ${ICONS[variant] || ""}
          <div class="modal-title">${title}</div>
        </div>
      `;

    container.appendChild(modalContainer);

    return new Promise((resolve) => {
      const toast = modalContainer.querySelector(".modal-toast");
      setTimeout(() => {
        toast.classList.add("fade-out");

        modalContainer.remove();
        resolve(null);
      }, duration);
    });
  }

  // NOTE: Only show icons for confirm containers
  modalContainer.innerHTML = `
  <div class="modal">
    ${
      type === ModalType.CONFIRM
        ? showCloseBtn
          ? `<button type="button" class="close-btn">${MWC_ICONS.close}</button>`
          : ICONS[variant] || ""
        : ""
    }
    <div class="modal-title">${title}</div>
    ${messageSection}
    ${inputSection}
    <div class="modal-actions">
      <button class="modal-btn cancel">${cancelText}</button>
      <button class="modal-btn confirm ${variant}">${confirmText}</button>
    </div>
  </div>
`;

  // Add to document
  container.appendChild(modalContainer);

  // Get elements
  const input = modalContainer.querySelector(".modal-input") as HTMLInputElement;
  const errorDiv = modalContainer.querySelector(".modal-error") as HTMLElement;
  const confirmBtn = modalContainer.querySelector(".confirm") as HTMLElement;
  const cancelBtn = modalContainer.querySelector(".cancel");
  const closeBtn = modalContainer.querySelector(".close-btn");

  // Set initial focus
  if (input) {
    input.selectionStart = input.value.length;
    input.focus();
  }

  return new Promise((resolve) => {
    const validateAndSubmit = () => {
      if (type === ModalType.INPUT) {
        const value = input.value.trim();
        if (validation) {
          const errorMessage = validation(value);
          if (errorMessage) {
            showError(errorMessage);
            return;
          }
        }
        resolve(value);
      } else {
        resolve(true);
      }
      cleanup();
    };

    const cleanup = () => {
      modalContainer.classList.add("fade-out");
      setTimeout(() => {
        modalContainer.remove();
        container.style.position = originalPosition;
      }, 200);
    };

    const showError = (message: string) => {
      errorDiv.textContent = message;
      errorDiv.style.opacity = "1";
      errorDiv.style.height = "auto";
      input.classList.add("error");

      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 500);
    };

    const clearError = () => {
      if (errorDiv) {
        errorDiv.style.opacity = "0";
        errorDiv.style.height = "0px";
        input?.classList.remove("error");
      }
    };

    // Event Listeners
    confirmBtn?.addEventListener("click", validateAndSubmit);

    cancelBtn?.addEventListener("click", () => {
      resolve(false);
      cleanup();
    });

    closeBtn?.addEventListener("click", () => {
      resolve(null);
      cleanup();
    });

    if (input) {
      input.addEventListener("input", (e) => {
        let value = (e.target as HTMLInputElement).value;
        value = value.replace(/[\x00-\x1F\x7F]/g, "");
        if (value.startsWith(" ")) {
          value = value.trimStart();
        }
        (e.target as HTMLInputElement).value = value;
        clearError();

        // Enable/disable confirm button based on input value
        confirmBtn.classList.toggle("disabled", !value.trim());
      });

      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          validateAndSubmit();
        } else if (e.key === "Escape") {
          resolve(false);
          cleanup();
        }
      });
      confirmBtn.classList.toggle("disabled", !input.value.trim());
    }

    // Close on backdrop click
    modalContainer.addEventListener("click", (e) => {
      if (e.target === modalContainer) {
        resolve(null);
        cleanup();
      }
    });

    // Close on escape key
    document.addEventListener("keyup", function handler(e) {
      if (e.key === "Escape") {
        document.removeEventListener("keyup", handler);
        resolve(false);
        cleanup();
      }
    });
  });
}

const MODAL_STYLES = `
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.modal-overlay.toast {
  background-color: transparent;
  pointer-events: none;
}

.modal-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  width: 80px;
  height: 80px;
  z-index: 1001;
  opacity: 1;
  animation: toastIn 0.2s ease-out;
}

.modal-toast.fade-out {
  animation: toastOut 0.2s ease-out forwards;
}


.modal-toast .modal-icon {
  width: 24px;
  height: 24px;
}

.modal-overlay:not(.toast) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.modal-overlay.fade-out {
  animation: fadeOut 0.2s ease-out;
}

.modal {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  width: 90%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.modal-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto;
}

.modal-icon.warning {
  color: #f59e0b;
}

.modal-icon.error {
  stroke: #ef4444;
}

.modal-title {
  font-size: 16px;
  font-family: Verdana;
  text-align: center;
  padding-bottom: 1rem;
}

.modal-toast .modal-title {
  color: white;
  padding-bottom: 0;
  text-align: center;
}

.modal .close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
}

.modal .close-btn svg {
  color: #858585;
}

.modal-message {
  font-size: 14px;
  font-family: Verdana;
  color: #666;
  text-align: center;
}

.modal-input-container {
  display: flex;
  flex-direction: column;
}

.modal-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-family: Verdana;
  transition: border-color 0.2s;
}

.modal-input.error {
  border-color: #ef4444;
}

.modal-input.shake {
  animation: shake 0.5s;
}

.modal-error {
  color: #ef4444;
  font-size: 12px;
  min-height: 0;
  opacity: 0;
  transition: opacity 0.2s, height 0.2s;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.modal-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-family: Verdana;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-btn:hover {
  opacity: 0.9;
}

.modal-btn.cancel {
  background-color: #e6e6e6;
  color: #333;
}

.modal-btn.confirm {
 background-color: #fe8e14;
  color: white;
}

.modal-btn.confirm.warning {
  background-color: #FE8E14;
}

.modal-btn.confirm.error {
  background-color: #ef4444;
}

.modal-btn.confirm.info {
  background-color: #FE8E14;
}

.modal-btn.confirm.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes toastIn {
  0% { 
    opacity: 0;
    transform: translate(-50%, calc(-50% + 20px));
  }
  100% { 
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes toastOut {
  0% { 
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  100% { 
    opacity: 0;
    transform: translate(-50%, calc(-50% - 20px));
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}
`;
