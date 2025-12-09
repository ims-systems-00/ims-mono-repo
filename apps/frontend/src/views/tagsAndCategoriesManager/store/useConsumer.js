import { useContext } from "react";
import { TagsAndCategoriesContext } from "./Context";
export default function useConsumer() {
  const { ...store } = useContext(TagsAndCategoriesContext);
  return { ...store };
}
