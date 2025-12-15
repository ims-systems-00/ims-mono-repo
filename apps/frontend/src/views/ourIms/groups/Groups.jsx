import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { getGroups } from "@/services/iamGroupServices";
import { imsLogger } from "@/services/loggerService";
import filters from "./filters/groups";
import CreateGroup from "./GroupForm";
import GroupTable from "./GroupTable";
import LOADERS from "./LoadingActions";
import Box from "@/components/Box/Index";
import { DrawerRight } from "@ims-systems-00/ims-ui-kit";

const Groups = (props) => {
  let [groups, setGroups] = useState([]);
  imsLogger(groups?.length);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADERS.LOAD_GROUPS, status: true },
    { action: LOADERS.CREATE_GROUP },
    { action: LOADERS.LOAD_POLICIES, status: true },
    { action: LOADERS.DELETE_GROUP },
  ]);
  let { authGlobalAccess } = useAccess();

  let { query, getQuery, updatePagination, ...queryHandlers } = useQuery({
    filter: getFilters().find((item) => item.default),
  });

  const addToTable = (group) =>
    setGroups((prevGroups) => [group, ...prevGroups]);

  const fetchData = async (qStr) => {
    try {
      dispatch({
        [LOADERS.LOAD_GROUPS]: { status: true, error: false, id: null },
      });
      let { data } = await getGroups({ query: `${qStr}` });
      setGroups(data.iamGroups);
      updatePagination(data.pagination);
      dispatch({
        [LOADERS.LOAD_GROUPS]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADERS.LOAD_GROUPS]: { status: false, error: true, id: null },
      });
      imsLogger("Groups", ex.response);
    }
  };

  React.useEffect(() => {
    fetchData(getQuery());
  }, [query]);

  function getFilters() {
    return authGlobalAccess() ? filters : [];
  }

  return (
    <div className="content">
      <Box>
        <GroupTable
          dataTable={groups}
          processing={processing}
          setGroups={setGroups}
          dispatch={dispatch}
          fetchData={fetchData}
          filters={getFilters()}
          queryHandlers={queryHandlers}
        />
      </Box>

      <DrawerRight drawerId="create-group-drawer" size={50}>
        <div className="p-3">
          <h4 className="mb-4">Create a function</h4>
          <CreateGroup
            {...props}
            dispatch={dispatch}
            processing={processing}
            addToTable={addToTable}
          />
        </div>
      </DrawerRight>
    </div>
  );
};

export default Groups;
