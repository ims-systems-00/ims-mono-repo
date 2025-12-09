import { useState } from "react";
import { imsLogger } from "@/services/loggerService";
import { getTenants } from "@/services/tenantServices";

function useTenants() {
  let [tenants, setTenants] = useState([]);
  async function loadTenants({ keywords = "", page = 1 }) {
    try {
      let { data } = await getTenants({
        query: `keywords=${keywords}&page=${page}`,
      });
      if (data.pagination.hasNextPage) {
        loadTenants({ keywords, page: data.pagination.nextPage });
      }
      setTenants(data.tenants);
    } catch (ex) {
      imsLogger("UserForm", ex.response || ex);
    }
  }
  return {
    tenants,
    loadTenants,
  };
}

export default useTenants;
