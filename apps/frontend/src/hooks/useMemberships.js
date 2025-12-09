import { useEffect, useState } from "react";
import { imsLogger } from "../services/loggerService";
import { listMemberships } from "../services/membershipService";

function useMemberships() {
  let [memberships, setMemberships] = useState([]);
  let [loadingMemberships, setLoadingMemberships] = useState(false);
  async function lazyLoadUsers(options) {
    let currentPage = options?.currentPage || 1;
    try {
      let { data } = await listMemberships({
        query: `page=${currentPage}`,
      });
      if (data.details.pagination.hasNextPage) {
        lazyLoadUsers({ currentPage: data.details.pagination.nextPage });
      }
      setMemberships((prevmemberships) => [
        ...prevmemberships,
        ...data.details.memberships,
      ]);
    } catch (ex) {
      imsLogger(ex.response || ex);
    }
  }
  useEffect(() => {
    async function loadLazy() {
      setLoadingMemberships(true);
      await lazyLoadUsers();
      setLoadingMemberships(false);
    }
    loadLazy();
  }, []);
  return {
    memberships,
    loadingMemberships,
  };
}

export default useMemberships;
