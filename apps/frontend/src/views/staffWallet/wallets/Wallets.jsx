import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import { Button, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import { getAllUsers } from "@/services/userServices";
import USER_ACTIONS from "../expenseReport/actions";
import ManageIndividualEmployee from "./ManageIndividualEmployee";
import { Card } from "@ims-systems-00/ims-ui-kit";

const Wallets = () => {
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_EMPLOYEES, status: true, hasMore: true },
  ]);
  let [employees, setEmployees] = React.useState([]);
  let {
    query,
    toolState,
    getQuery,
    updatePagination,
    handlePagination,
    ...queryHandlers
  } = useQuery({
    required: { value: { lineManagers: getCurrentSessionData()?.user?._id } },
  });
  let notify = React.useContext(NotificationContext);
  const fetchEmployees = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_EMPLOYEES]: {
          status: true,
          error: false,
          hasMore: true,
        },
      });
      let { data } = await getAllUsers({
        query: `${qStr}`,
      });
      setEmployees((prevData) => [...prevData, ...data.users]);
      updatePagination(data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_EMPLOYEES]: {
          status: false,
          error: false,
          hasMore: data.pagination.hasNextPage,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_EMPLOYEES]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ManageReports", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };
  React.useEffect(() => {
    fetchEmployees(getQuery());
  }, [query]);
  let { authUser } = useAccess();
  return (
    <div className="content">
      <Panels defaultPanel={"Staff Wallets"} navLinks={["Staff Wallets"]}>
        <Panel panelId="Staff Wallets">
          <Card>
            {processing[USER_ACTIONS.LOAD_EMPLOYEES].status && <Loading />}
            <Row>
              {employees.map((employee) => (
                <ManageIndividualEmployee
                  key={employee._id}
                  employee={employee}
                />
              ))}
            </Row>
            {toolState.pagination.hasNextPage && (
              <Button
                onClick={() => {
                  handlePagination({ page: toolState.pagination.nextPage });
                }}
                disabled={processing[USER_ACTIONS.LOAD_EMPLOYEES].status}
                className=" btn-block"
                color="primary"
              >
                {processing[USER_ACTIONS.LOAD_EMPLOYEES].status ? (
                  <Loading />
                ) : (
                  <span className=" font-size-subtitle-2">
                    View more{" "}
                    <i className="ims-icons-16 icon-icon-filearrowdown-24" />
                  </span>
                )}
              </Button>
            )}
          </Card>
        </Panel>
      </Panels>
    </div>
  );
};

export default Wallets;
