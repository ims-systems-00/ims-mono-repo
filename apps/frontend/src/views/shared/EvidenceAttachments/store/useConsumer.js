import { useContext } from "react";
import { EvidenceAttachmentContext } from "./Context";

export function useEvidenceAttachment() {
  const { ...store } = useContext(EvidenceAttachmentContext);
  return { ...store };
}
