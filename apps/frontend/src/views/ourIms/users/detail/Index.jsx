import { UserManagerContextProvider } from "../store";
import UserProfile from "./UserProfile";

const Index = (props) => {
  return (
    <UserManagerContextProvider {...props}>
      <UserProfile />
    </UserManagerContextProvider>
  );
};

export default Index;
