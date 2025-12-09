import { LeaveContextProvider } from "../store";
import LeaveDetail from "./LeaveDetail";

const Index = (props) => {
  return (
    <LeaveContextProvider {...props}>
      <LeaveDetail />
    </LeaveContextProvider>
  );
};

export default Index;
