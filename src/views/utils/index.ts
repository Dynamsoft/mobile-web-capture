export function isMobile() {
  return "ontouchstart" in document.documentElement;
}

// Format ticks from C#
export function formatTicks(ticks?: string): string {
  if (!ticks) return "";
  const ticksTo1970 = 621355968000000000;
  const ticksPerMillisecond = 10000;

  const milliseconds = (Number(ticks) - ticksTo1970) / ticksPerMillisecond;
  const date = new Date(milliseconds);

  // Get time zone offset in minutes and convert to milliseconds
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(milliseconds + timezoneOffset);

  return localDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getElement(element: string | HTMLElement): HTMLElement | null {
  if (typeof element === "string") {
    return document.querySelector(element);
  }
  return element instanceof HTMLElement ? element : null;
}

export function getFileNameWithoutExtension(fileName: string) {
  if (!fileName) {
    return `Doc-${Date.now()}`;
  }
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
}

export function createStyle(id: string, style: string) {
  // Initialize styles if not already done
  if (!document.getElementById(id)) {
    const styleSheet = document.createElement("style");
    styleSheet.id = id;
    styleSheet.textContent = style;
    document.head.appendChild(styleSheet);
  }
}

export function isSVGString(str: string): boolean {
  return str.trim().startsWith("<svg") && str.trim().endsWith("</svg>");
}
