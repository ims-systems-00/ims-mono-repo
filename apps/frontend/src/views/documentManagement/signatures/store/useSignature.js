import { useContext } from "react";
import { imsLogger } from "@/services/loggerService";
import { SignatureContext } from "./Context";
export default function useSignature() {
  const { ...store } = useContext(SignatureContext);
  imsLogger(store);
  return { ...store };
}
