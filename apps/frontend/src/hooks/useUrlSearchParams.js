import React from "react";
import { useHistory, useLocation } from "react-router-dom";
function useUrlSearchParams() {
  const { search } = useLocation();
  const history = useHistory();
  function setSearch(search) {
    history.push({
      search,
    });
  }
  return {
    query: React.useMemo(() => new URLSearchParams(search), [search]),
    setSearch,
  };
}
export default useUrlSearchParams;
