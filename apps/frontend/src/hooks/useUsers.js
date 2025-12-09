import { useState } from "react";
import { imsLogger } from "@/services/loggerService";
import { getAllUsers } from "../services/userServices";

function useUsers() {
  let [users, setUsers] = useState([]);
  async function lazyLoadUsers(options) {
    let currentPage = options?.currentPage || 1;
    try {
      let { data } = await getAllUsers({
        query: `page=${currentPage}`,
      });
      if (data.pagination.hasNextPage) {
        lazyLoadUsers({ currentPage: data.pagination.nextPage });
      }
      setUsers((prevUsers) => [...prevUsers, ...data.users]);
    } catch (ex) {
      imsLogger("UserForm", ex.response || ex);
    }
  }
  return {
    users,
    lazyLoadUsers,
  };
}

export default useUsers;
