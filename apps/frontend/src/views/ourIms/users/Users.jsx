import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import UsersTable from "./UsersTable";
import { UserManagerContextProvider } from "./store";
import InvitationsTable from "./InvitationsTable";
import NavigationTabs from "@/components/NavigationTabs";
import useAccess from "@/hooks/useAccess";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";

const Users = (props) => {
  let { authUser } = useAccess();
  
  return (
    <DrawerContextProvider>
      <UserManagerContextProvider {...props}>
        <NavigationTabs
          activeTab="allUsers"
          navigations={[
            {
              id: "allUsers",
              text: "All Users",
              icon: (
                <i className="ims-icons-20 icon-icon-users-24 me-1"></i>
              ),
              component: <UsersTable {...props} />,
            },
            ...(authUser({
              service: IMS_SERVICES.INVITATIONS,
              action: ACTIONS.MANAGE,
              effect: EFFECTS.ALLOW,
            })
              ? [
                  {
                    id: "invitations",
                    text: "Invitations",
                    icon: (
                      <i className="ims-icons-20 icon-icon-check-24 me-1"></i>
                    ),
                    component: <InvitationsTable />,
                  },
                ]
              : []),
          ]}
        />
      </UserManagerContextProvider>
    </DrawerContextProvider>
  );
};

export default Users;