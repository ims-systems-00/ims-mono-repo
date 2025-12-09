import { uploadFileToS3 } from "@/services/fileHandlerService";
import { getSignedUrl } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
export async function linkGenerator(metaData) {
  let link = null;
  try {
    let { data } = await getSignedUrl(metaData);
    link = data.url;
  } catch (err) {
    imsLogger(err);
  }
  return link;
}

export async function handleUpload(file, config) {
  let storageInfo = null;
  try {
    let { data } = await uploadFileToS3(file, "general", config);
    storageInfo = data.uploadInformation;
  } catch (err) {
    imsLogger(err);
  }
  return storageInfo;
}
