import { RiskContextProvider } from "../store";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";
import RiskDetailsNew from "./RiskDetailsNew";

const Index = (props) => {
  return (
    <RiskContextProvider {...props}>
      <TaskContextProvider>
        <TagsAndCategoriesContextProvider applicableModules={"risks"}>
          <RiskDetailsNew />
          {/* <RiskDetail /> */}
        </TagsAndCategoriesContextProvider>
      </TaskContextProvider>
    </RiskContextProvider>
  );
};

export default Index;
