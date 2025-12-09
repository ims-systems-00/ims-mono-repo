import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import LeavesTable from "./LeavesTable";
import { LeaveContextProvider } from "./store";

const Leaves = (props) => {
  return (
    <DrawerContextProvider>
      <LeaveContextProvider {...props}>
        <LeavesTable {...props} />
      </LeaveContextProvider>
    </DrawerContextProvider>
  );
};

export default Leaves;
