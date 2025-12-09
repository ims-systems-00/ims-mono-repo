import { imsLogger } from "@/services/loggerService";

export function downloader(fileName, data) {
  const downloadUrl = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  imsLogger("downloader", "Download success ...", data);
}
