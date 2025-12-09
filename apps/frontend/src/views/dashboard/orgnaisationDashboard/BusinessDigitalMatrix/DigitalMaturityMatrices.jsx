import Loading from "@/components/Loader/Loading";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import React from "react";
import { Button } from "@ims-systems-00/ims-ui-kit";
import { getAllDashboards } from "@/services/dashBoardServices";
import { imsLogger } from "@/services/loggerService";
import { asynchronously } from "@/utils/asynchronous";
import USER_ACTIONS from "./actions";
import IndividualMatrix from "./IndividualMatrix";

const DigitalMaturityMatrices = (props) => {
  const [digitalMatrices, setDigitalMatrices] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_MATRICES, status: true, hasMore: true },
  ]);
  let { query, toolState, getQuery, updatePagination, handlePagination } =
    useQuery({});
  async function fetchMatrices(qstr) {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_MATRICES]: {
          status: true,
          error: false,
          hasMore: true,
        },
      });
      const [loadError, response] = await asynchronously(
        getAllDashboards({ query: `${qstr}` })
      );
      if (loadError) return imsLogger(loadError);
      imsLogger(response);
      setDigitalMatrices((prevData) => [
        ...prevData,
        ...response.data.dashboards,
      ]);
      updatePagination(response.data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_MATRICES]: {
          status: false,
          error: false,
          id: null,
          hasMore: response.data.pagination.hasNextPage,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_MATRICES]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("DigitalMatrices", ex, ex.response);
    }
  }
  React.useEffect(() => {
    fetchMatrices(getQuery());
  }, [query]);
  return (
    <div className="content">
      {processing[USER_ACTIONS.LOAD_MATRICES].status && <Loading />}
      {digitalMatrices &&
        digitalMatrices.map((matrix) => (
          <IndividualMatrix
            key={matrix._id}
            matrix={matrix}
            processing={processing}
            dispatch={dispatch}
          />
        ))}
      {toolState.pagination.hasNextPage && (
        <Button
          onClick={() => {
            handlePagination({ page: toolState.pagination.nextPage });
          }}
          size="sm"
          disabled={processing[USER_ACTIONS.LOAD_MATRICES].status}
          className=" btn-block"
          color="primary"
        >
          {processing[USER_ACTIONS.LOAD_MATRICES].status ? (
            <Loading />
          ) : (
            <span>
              View more{" "}
              <i className="ims-icons-16 icon-icon-filearrowdown-24" />
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

export default DigitalMaturityMatrices;
