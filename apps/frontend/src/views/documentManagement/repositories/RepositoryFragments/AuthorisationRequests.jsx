import Loading from "@/components/Loader/Loading";
import IMSSelectDropdown from "@/components/SelectDropdown/IMSSelectDropdown";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { getCurrentSessionData } from "@/services/authService";
import USER_ACTIONS from "@/views/documentManagement/actions";
import DocumentTable from "./DocumentTable";

const AuthorisationRequests = ({ repoId, tablePanel, setTablePanel }) => {
  let {
    query,
    toolState,
    getQuery,
    updatePagination,
    handlePagination,
    handleFilter,
    ...queryHandlers
  } = useQuery({
    required: {
      value: {},
    },
    filter: {
      value: {
        status: "Pending",
        size: 30,
        documentData: {
          authorisation: {
            user: getCurrentSessionData()?.user?._id,
          },
        },
      },
    },
  });
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_NODES, id: null, hasMore: true },
  ]);

  const [authorisationNode, setAuthorisationNode] = React.useState([]);

  const fetchAuthorisationNodes = async (qstr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_NODES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      setAuthorisationNode([]);
      dispatch({
        [USER_ACTIONS.LOAD_NODES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (error) {
      dispatch({
        [USER_ACTIONS.LOAD_NODES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  React.useEffect(() => {
    if (tablePanel === "Authorisation Requests") {
      fetchAuthorisationNodes(getQuery());
    }
  }, [query, tablePanel]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h4 className="mb-0">Authorisation Requests</h4>
        <div className="d-flex">
          <div>
            <IMSSelectDropdown
              onSelect={(value) => {
                if (value === "My Requests") {
                  handleFilter({
                    value: {
                      status: "Pending",
                      size: 30,
                      created: {
                        by: getCurrentSessionData()?.user?._id,
                      },
                    },
                  });
                } else if (value === "Received Requests") {
                  handleFilter({
                    value: {
                      status: "Pending",
                      size: 30,
                      documentData: {
                        authorisation: {
                          user: getCurrentSessionData()?.user?._id,
                        },
                      },
                    },
                  });
                }
              }}
              showValue={true}
              buttonText={"Received Requests"}
              listItems={["Received Requests", "My Requests"]}
            />
          </div>
          <div className="ims-faded-button">
            <Button
              onClick={() => {
                setTablePanel("");
              }}
            >
              Back To Table
            </Button>
          </div>
        </div>
      </div>
      {processing[USER_ACTIONS.LOAD_NODES].status ? (
        <Loading />
      ) : (
        <DocumentTable
          nodeList={authorisationNode}
          tablePanel={tablePanel}
          processing={processing}
          dispatch={dispatch}
          repoId={repoId}
        />
      )}
    </div>
  );
};

export default AuthorisationRequests;
