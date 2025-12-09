import { useState } from "react";
import { getCustomers } from "@/services/customerService";
import { imsLogger } from "@/services/loggerService";

function useCustomers() {
  let [customers, setCustomers] = useState([]);
  async function loadCustomers({ clientSearch = "", page = 1 }) {
    try {
      let { data } = await getCustomers({
        query: `clientSearch=${clientSearch}&page=${page}`,
      });
      if (data.pagination.hasNextPage) {
        loadCustomers({ clientSearch, page: data.pagination.nextPage });
      }
      setCustomers(data.customers);
    } catch (ex) {
      imsLogger("useCustomers", ex.response || ex);
    }
  }
  return {
    customers,
    loadCustomers,
  };
}

export default useCustomers;
