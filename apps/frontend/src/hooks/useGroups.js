import { useEffect, useState } from "react";
import { imsLogger } from "../services/loggerService";
import { getGroups } from "../services/iamGroupServices";

function useGroups() {
  let [groups, setGroups] = useState([]);
  let [loadingGroups, setLoadingGroups] = useState(false);
  async function lazyLoadGroups(options) {
    let currentPage = options?.currentPage || 1;
    try {
      let { data } = await getGroups({
        query: `page=${currentPage}`,
      });
      if (data.pagination.hasNextPage) {
        lazyLoadGroups({ currentPage: data.pagination.nextPage });
      }
      setGroups((prevmemberships) => [...prevmemberships, ...data.iamGroups]);
    } catch (ex) {
      imsLogger(ex.response || ex);
    }
  }
  useEffect(() => {
    async function loadLazy() {
      setLoadingGroups(true);
      await lazyLoadGroups();
      setLoadingGroups(false);
    }
    loadLazy();
  }, []);
  return {
    groups,
    loadingGroups,
  };
}

export default useGroups;
