import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import { Col, Card, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";
import { getCurrentSessionData } from "@/services/authService";
import {
  getRatingOverview,
  getTool,
  mapToToolOverview,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { getNotifications } from "@/services/notificationService";
import { getAllUsers } from "@/services/userServices";
import { filterUsersByGroup } from "@/utils/filters";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import useProcessingControl from "../../../hooks/useProcessingControl";
import CQCNotice from "./CQCNotice";
import CQCNoticeTable from "./CQCNoticeTable";
import MembersTable from "./MembersTable";
import RatingForm from "./RatingForm";
import SiteOverview from "./SiteOverview";
import SiteToolTable from "./SiteToolTable";
import ACTIONS from "./actions";
import SiteActionsContextProvider from "./context/SiteActionsContext";

const filters = [
  {
    value: "",
    label: "All KLOEs",
    default: true,
  },
  {
    value: { clause: { regex: "^S.*$" } },
    label: "Safe",
  },
  {
    value: { clause: { regex: "^E.*$" } },
    label: "Effective",
  },
  {
    value: { clause: { regex: "^C.*$" } },
    label: "Caring",
  },
  {
    value: { clause: { regex: "^R.*$" } },
    label: "Responsive",
  },
  {
    value: { clause: { regex: "^W.*$" } },
    label: "Well Led",
  },
];

function Header({ overview, processing }) {
  return (
    <ErrorHandlerComponent
      hasError={processing.error}
      errorMessage="This Tool has been deleted or removed"
    >
      <Row>
        <Col md="6" className="mb-4">
          <h4 className="text-primary">Business unit</h4>
          <p>{overview?.group?.name}</p>
        </Col>
        <Col md="6" className="mb-4">
          <h4 className="text-primary">Location</h4>
          <p>{overview.group.details.operatingLocation}</p>
        </Col>
      </Row>
    </ErrorHandlerComponent>
  );
}

const SiteDetails = (props) => {
  let { authUser, authSuperUser } = useAccess();
  let [overview, setOverview] = useState(null);
  let [tool, setTool] = useState([]);
  let [members, setMembers] = useState([]);
  let [cqcNotices, setCqcNotices] = React.useState([]);
  let [dataSet, setDataSet] = React.useState({});
  let { processing, dispatch } = useProcessingControl([
    { action: ACTIONS.LOAD_OVERVIEW },
    { action: ACTIONS.LOAD_TOOLS },
    { action: ACTIONS.LOAD_NOTICES },
    { action: ACTIONS.LOAD_MEMBERS },
    { action: ACTIONS.UPDATE_RATINGS },
    { action: ACTIONS.ADD_COMMUNICATE },
  ]);

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: { value: { group: props.match.params.groupId } },
      filter: filters.find((item) => item.default),
    });

  let {
    query: noticeQuery,
    toolState: noticeToolState,
    getQuery: NoticeGetQuery,
    updatePagination: noticeUpdatePagination,
    ...noticeQueryHandlers
  } = useQuery({
    required: {
      value: {
        userId: getCurrentSessionData().user?._id,
        cqc: true,
        actor: true,
      },
    },
  });

  let {
    query: userQuery,
    toolState: userToolState,
    getQuery: userGetQuery,
    updatePagination: userUpdatePagination,
    ...userQueryHandlers
  } = useQuery({
    required: {
      value: { accessPolicies: { group: props.match.params.groupId } },
    },
  });

  const refreshOverview = (overview) => setOverview(overview);

  const fetchTool = async (qStr) => {
    try {
      dispatch({
        [ACTIONS.LOAD_TOOLS]: { status: true, error: false, id: null },
      });
      let { data } = await getTool({
        query: `${qStr} `,
      });
      setTool(data.tool);
      updatePagination(data.pagination);
      dispatch({
        [ACTIONS.LOAD_TOOLS]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [ACTIONS.LOAD_TOOLS]: { status: false, error: true, id: null },
      });
      imsLogger("SiteDetails", ex, ex.response);
    }
  };

  const fetchNotices = async (qStr) => {
    try {
      dispatch({
        [ACTIONS.LOAD_NOTICES]: { status: true, error: false, id: null },
      });
      let { data } = await getNotifications({
        query: `${qStr}`,
      });
      setCqcNotices(data.notifications);
      // noticeUpdatePagination(data.pagination);
      dispatch({
        [ACTIONS.LOAD_NOTICES]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [ACTIONS.LOAD_NOTICES]: { status: false, error: true, id: null },
      });
      imsLogger("SiteDetails", ex, ex.response);
    }
  };

  const fetchUsers = async (qStr) => {
    try {
      dispatch({
        [ACTIONS.LOAD_MEMBERS]: { status: true, error: false, id: null },
      });
      let { data } = await getAllUsers({
        query: `${qStr}`,
      });
      setMembers(data.users);
      userUpdatePagination(data.pagination);
      dispatch({
        [ACTIONS.LOAD_MEMBERS]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [ACTIONS.LOAD_MEMBERS]: { status: false, error: true, id: null },
      });
      imsLogger("SiteDetails", ex, ex.response);
    }
  };

  async function fetchOverview(qStr) {
    try {
      dispatch({
        [ACTIONS.LOAD_OVERVIEW]: { status: true, error: false, id: null },
      });
      let { id } = props.match.params;
      let { data } = await getRatingOverview(id, {
        query: `group=${props.match.params.groupId}`,
      });
      let mapedData = mapToToolOverview(data.overview);
      setOverview(data.overview);
      setDataSet(mapedData);
      dispatch({
        [ACTIONS.LOAD_OVERVIEW]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [ACTIONS.LOAD_OVERVIEW]: { status: false, error: true, id: null },
      });
      imsLogger("SiteDetails", ex, ex.response);
    }
  }

  React.useEffect(() => {
    fetchOverview();
    fetchTool(getQuery());
  }, [query]);

  React.useEffect(() => {
    fetchUsers(userGetQuery());
  }, [userQuery]);

  React.useEffect(() => {
    fetchNotices(NoticeGetQuery());
  }, [noticeQuery]);

  let updateDataTable = () => {
    fetchTool(getQuery());
  };

  const addToCqcNoticeTable = (cqcNotice) =>
    setCqcNotices((prevCqcNotices) => [cqcNotice, ...prevCqcNotices]);
  return (
    <React.Fragment>
      <div className="content">
        <SiteActionsContextProvider value={{ overview, refreshOverview }}>
          <Panels
            navLinks={[
              "Overview",
              "KLOE-Prompts",
              "Ratings",
              "Members",
              "Communicate",
            ]}
            backLinks={
              authSuperUser()
                ? [
                    {
                      linkText: "Back",
                      link: props.match.path.split("/:")[0],
                    },
                  ]
                : []
            }
            defaultPanel={"Overview"}
          >
            {overview && (
              <Header
                processing={processing[ACTIONS.LOAD_OVERVIEW]}
                overview={overview}
              />
            )}
            <Panel panelId="Overview">
              <Card>
                <ErrorHandlerComponent
                  hasError={processing[ACTIONS.LOAD_OVERVIEW].error}
                  errorMessage="This Tool has been deleted or removed"
                >
                  {processing[ACTIONS.LOAD_OVERVIEW].status ? (
                    <Loading />
                  ) : (
                    overview && (
                      <SiteOverview overview={overview} dataSet={dataSet} />
                    )
                  )}
                </ErrorHandlerComponent>
              </Card>
            </Panel>
            <Panel panelId="KLOE-Prompts">
              <Card>
                <ErrorHandlerComponent
                  hasError={processing[ACTIONS.LOAD_TOOLS].error}
                  errorMessage="This Tool has been deleted or removed"
                >
                  {processing[ACTIONS.LOAD_TOOLS].status && <Loading />}
                  <SiteToolTable
                    dataTable={tool}
                    updateDataTable={updateDataTable}
                    overview={overview}
                    processing={processing}
                    dispatch={dispatch}
                    pathname={`/admin/cqc/controls`}
                    setTool={setTool}
                    onPageChange={fetchTool}
                    pagination={toolState.pagination}
                    filters={filters}
                    {...queryHandlers}
                  />
                </ErrorHandlerComponent>
              </Card>
            </Panel>
            <Panel panelId="Ratings">
              <Card>
                <ErrorHandlerComponent
                  hasError={processing[ACTIONS.LOAD_OVERVIEW].error}
                  errorMessage="This Tool has been deleted or removed"
                >
                  {processing[ACTIONS.LOAD_OVERVIEW].status ? (
                    <Loading />
                  ) : (
                    overview && (
                      <RatingForm
                        {...props}
                        overview={overview}
                        processing={processing}
                        dispatch={dispatch}
                        refreshOverview={refreshOverview}
                      />
                    )
                  )}
                </ErrorHandlerComponent>
              </Card>
            </Panel>
            <Panel panelId="Communicate">
              <Card>
                <ErrorHandlerComponent
                  hasError={processing[ACTIONS.LOAD_NOTICES].error}
                  errorMessage="This Tool has been deleted or removed"
                >
                  {processing[ACTIONS.LOAD_NOTICES].status ? (
                    <Loading />
                  ) : (
                    <CQCNotice
                      overview={overview}
                      addToCqcNoticeTable={addToCqcNoticeTable}
                      processing={processing}
                      dispatch={dispatch}
                      {...props}
                    />
                  )}
                  <CQCNoticeTable
                    dataTable={cqcNotices}
                    processing={processing}
                    onPageChange={fetchNotices}
                    pagination={noticeToolState.pagination}
                    {...noticeQueryHandlers}
                  />
                </ErrorHandlerComponent>
              </Card>
            </Panel>
            <Panel panelId="Members">
              <Card>
                <ErrorHandlerComponent
                  hasError={processing[ACTIONS.LOAD_MEMBERS].error}
                  errorMessage="This Tool has been deleted or removed"
                >
                  {processing[ACTIONS.LOAD_MEMBERS].status && <Loading />}
                  <MembersTable
                    dataTable={members.filter((user) =>
                      filterUsersByGroup(
                        user.membership,
                        props.match.params.groupId
                      )
                    )}
                    processing={processing}
                    dispatch={dispatch}
                    setMembers={setMembers}
                    pathname={"/admin/users"}
                    pagination={userToolState.pagination}
                    {...userQueryHandlers}
                  />
                </ErrorHandlerComponent>
              </Card>
            </Panel>
          </Panels>
        </SiteActionsContextProvider>
      </div>
    </React.Fragment>
  );
};

export default SiteDetails;
