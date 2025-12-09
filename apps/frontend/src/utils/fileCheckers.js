import { imsLogger } from "@/services/loggerService";

export const checkFileSize = (file, sizeLimit = 2500000) => {
  if (file.size > sizeLimit) {
    imsLogger("file size limit exeeded");
    return false;
  }
  return true;
};
