import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { RiskContextProvider } from "../store";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";
import RiskDetailsNew from "./RiskDetailsNew";

const Index = (props) => {
  return (
    <RiskContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <TagsAndCategoriesContextProvider applicableModules={"risks"}>
            <RiskDetailsNew />
            {/* <RiskDetail /> */}
          </TagsAndCategoriesContextProvider>
        </TaskContextProvider>
      </DrawerContextProvider>
    </RiskContextProvider>
  );
};

export default Index;
