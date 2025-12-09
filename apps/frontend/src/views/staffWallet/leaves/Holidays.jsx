import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import { Col, Row, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { getHolidays } from "@/services/wallet/leavesServices";
import USER_ACTIONS from "../expenseReport/actions";

const Holidays = ({ countryCode }) => {
  let [holidays, setHolidays] = React.useState([]);
  let notify = React.useContext(NotificationContext);
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_HOLIDAYS, status: true },
  ]);
  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({});
  const fetchLeaves = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_HOLIDAYS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getHolidays({
        query: `countryCode=${countryCode}&year=${new Date().getFullYear()}`,
      });
      setHolidays(data.holidays);
      dispatch({
        [USER_ACTIONS.LOAD_HOLIDAYS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_HOLIDAYS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Holidays", ex, ex.response);
      notify("Error occurred while fetching holidays data", "danger");
    }
  };
  React.useEffect(() => {
    fetchLeaves(getQuery());
  }, [query]);
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Table>
            <thead className="text-primary">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Start date</th>
                <th>End date</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday.name}>
                  <td>{holiday.name}</td>
                  <td>{holiday.type.toUpperCase()}</td>
                  <td>{moment(holiday.date).format("DD/MM/YYYY")}</td>
                  <td>{moment(holiday.start).format("DD/MM/YYYY")}</td>
                  <td>{moment(holiday.end).format("DD/MM/YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default Holidays;
