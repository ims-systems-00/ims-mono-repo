import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { UserManagerContextProvider } from "../store";
import UserProfile from "./UserProfile";

const Index = (props) => {
  return (
    <UserManagerContextProvider {...props}>
      <DrawerContextProvider>
        <UserProfile />
      </DrawerContextProvider>
    </UserManagerContextProvider>
  );
};

export default Index;
