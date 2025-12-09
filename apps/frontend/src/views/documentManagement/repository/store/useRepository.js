import { useContext } from "react";
import { RepositoryContext } from "./Context";
export default function useRepository() {
  const { ...store } = useContext(RepositoryContext);
  return { ...store };
}
