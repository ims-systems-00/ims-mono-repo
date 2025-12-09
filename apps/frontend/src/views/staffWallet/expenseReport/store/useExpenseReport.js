import { useContext } from "react";
import { ExpenseReportContext } from "./Context";

export default function useExpenseReport() {
  const { ...store } = useContext(ExpenseReportContext);
  return { ...store };
}
