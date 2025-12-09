import { useContext } from "react";
import { RepositoriesContext } from "./Context";
export default function useRepositories() {
  const { ...store } = useContext(RepositoriesContext);
  return { ...store };
}
