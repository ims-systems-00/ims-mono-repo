import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import Content from "./Content";
import { AnalyticalAssistantContextProvider } from "./store";
import { TaskContextProvider } from "@/views/taskManagement/store";
const AnalyticalAssistant = ({
  data,
  template = null,
  source = null,
  onCreateNewTask = () => {},
}) => {
  return (
    <DrawerContextProvider>
      <TaskContextProvider>
        <AnalyticalAssistantContextProvider
          data={data}
          template={template}
          source={source}
          onCreateNewTask={onCreateNewTask}
        >
          <Content />
        </AnalyticalAssistantContextProvider>
      </TaskContextProvider>
    </DrawerContextProvider>
  );
};

export default AnalyticalAssistant;
