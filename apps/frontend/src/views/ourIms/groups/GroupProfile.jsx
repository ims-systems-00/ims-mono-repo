import Loading from "@/components/Loader/Loading";
import { Card } from "@ims-systems-00/ims-ui-kit";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getGroup } from "@/services/iamGroupServices";
import { imsLogger } from "@/services/loggerService";
import { getAllUsers } from "@/services/userServices";
import AddUsers from "./AddUsers";
import Details from "./Details";
import GroupForm from "./GroupForm";
import LOADERS from "./LoadingActions";
import UsersTable from "./UsersTable";

const Groups = (props) => {
  const { isModalOpen = false } = props;
  let { processing, dispatch } = useProcessingControl([
    { action: LOADERS.LOAD_GROUP, status: true },
    { action: LOADERS.LOAD_USERS, status: true },
    { action: LOADERS.ADD_MEMBERS },
    { action: LOADERS.REMOVE_USER },
    { action: LOADERS.REVOKE_USER },
    { action: LOADERS.GRANT_ACCESS },
    { action: LOADERS.AMEND_GROUP },
    { action: LOADERS.CREATE_GROUP },
    { action: LOADERS.LOAD_POLICIES, status: true },
  ]);
  let { authUser } = useAccess();
  let [group, setGroup] = useState({});
  let [memebers, setMembers] = useState([]);
  let addToMembersTable = (member) =>
    setMembers((prevMembers) => [member, ...prevMembers]);
  let [hardReload, setHardReload] = useState(true);
  const reload = () => setHardReload((state) => !state);
  const refreshGroup = (group) => {
    setGroup(group);
    props.onUpdate && props.onUpdate(group);
  };
  let groupId =
    (props.match && props.match.params.id) || (props.view && props.view._id);
  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: {
        value: { membership: { groups: groupId } },
      },
    });

  const fetchUsers = async (qStr) => {
    try {
      dispatch({
        [LOADERS.LOAD_USERS]: { status: true, error: false, id: null },
      });
      let { data } = await getAllUsers({
        query: `${qStr}`,
      });
      setMembers(data.users);
      updatePagination(data.pagination);
      dispatch({
        [LOADERS.LOAD_USERS]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADERS.LOAD_USERS]: { status: false, error: true, id: null },
      });
      imsLogger("SiteDetails", ex, ex.response);
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        dispatch({
          [LOADERS.LOAD_GROUP]: { status: true, error: false, id: null },
        });
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getGroup(id);
        setGroup(data.iamGroup);
        dispatch({
          [LOADERS.LOAD_GROUP]: { status: false, error: false, id: null },
        });
      } catch (ex) {
        dispatch({
          [LOADERS.LOAD_GROUP]: { status: false, error: true, id: null },
        });
        imsLogger("GroupProfile", ex.response);
      }
    }
    fetchData();
  }, [hardReload]);

  React.useEffect(() => {
    fetchUsers(getQuery());
  }, [query]);

  return (
    <div className="content">
      <Panels
        isModalOpen={isModalOpen}
        defaultPanel={"Details"}
        navLinks={
          authUser({
            service: IMS_SERVICES.OUR_IMS,
            action: ACTIONS.UPDATE,
            effect: EFFECTS.ALLOW,
          })
            ? ["Details", "Add members", "Members"]
            : ["Details", "Members"]
        }
        backLinks={
          props.match && [
            {
              linkText: "Back",
              link: props.match.path.split("/:")[0],
            },
          ]
        }
      >
        {processing[LOADERS.LOAD_GROUP].status ? (
          <Loading />
        ) : (
          <>
            <Panel panelId="Details">
              <SwitchableView
                viewTitle={group.name}
                canSwitch={authUser({
                  service: IMS_SERVICES.IAM_GROUPS,
                  action: ACTIONS.CREATE,
                  effect: EFFECTS.ALLOW,
                })}
              >
                <SecondaryWrapperChild>
                  <GroupForm
                    group={group}
                    dispatch={dispatch}
                    processing={processing}
                    refreshGroup={refreshGroup}
                  />
                </SecondaryWrapperChild>
                <PrimaryWrapperChild>
                  <Details group={group} />
                </PrimaryWrapperChild>
              </SwitchableView>
            </Panel>
            <Panel panelId="Add members">
              <Card>
                <AddUsers
                  group={group}
                  addToMembersTable={addToMembersTable}
                  dispatch={dispatch}
                  processing={processing}
                  reload={reload}
                />
                <div style={{ height: 120 }}></div>
              </Card>
            </Panel>
            <Panel panelId="Members">
              <Card>
                <UsersTable
                  group={group}
                  dataTable={memebers}
                  processing={processing}
                  dispatch={dispatch}
                  setMembers={setMembers}
                  pathname={"/admin/users"}
                  reload={reload}
                  pagination={toolState.pagination}
                  {...queryHandlers}
                />
              </Card>
            </Panel>
          </>
        )}
      </Panels>
    </div>
  );
};

export default Groups;
