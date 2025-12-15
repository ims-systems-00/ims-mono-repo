import LeavesTable from "./LeavesTable";
import { LeaveContextProvider } from "./store";

const Leaves = (props) => {
  return (
    <LeaveContextProvider {...props}>
      <LeavesTable {...props} />
    </LeaveContextProvider>
  );
};

export default Leaves;
