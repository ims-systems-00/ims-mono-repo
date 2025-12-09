import React from "react";
import { imsLogger } from "@/services/loggerService";
import AddUsers from "./AddUsers";
import UserTable from "./UserTable";
const Groups = (props) => {
  React.useEffect(() => {
    async function fetchData() {
      try {
      } catch (ex) {
        imsLogger("Users", ex.response);
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <AddUsers />
      <UserTable />
    </>
  );
};

export default Groups;
