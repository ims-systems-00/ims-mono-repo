import { useContext } from "react";
import { RequestSignature } from "./Context";
export default function useRequestSignature() {
  const { ...store } = useContext(RequestSignature);
  return { ...store };
}
