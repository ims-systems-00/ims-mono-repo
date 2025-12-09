import useDataProcessing from "@/hooks/useProcessing";
import { useState, useEffect } from "react";
const useNotification = () => {
  let [groups, setGroups] = useState([]);
  let { processing, setProcessing, btnProcessing } = useDataProcessing();

  function addToGroup() {
    // state management
  }
  function removeFromGroup() {
    // state mangement
  }
  function updateGroup() {
    // state management
  }
  return {
    groups,
    addToGroups,
    removeFromGroups,
    updateGroup,
  };
};

export default useNotification;
