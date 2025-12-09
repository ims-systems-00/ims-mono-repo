import { useState } from "react";
import { imsLogger } from "@/services/loggerService";
import { getConstants } from "@/services/staticContantsServices";
import useQuery from "./useQuery";

function useConstants() {
  let [constants, setConstants] = useState([]);
  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: {
        value: {
          constantName: "COUNTRIES",
        },
      },
    });
  async function loadConstants(qStr) {
    try {
      let { data } = await getConstants({
        query: `constantName=COUNTRIES`,
      });
      setConstants(data.data);
    } catch (ex) {
      imsLogger("useConstants", ex.response || ex);
    }
  }
  return {
    constants,
    loadConstants,
  };
}

export default useConstants;
