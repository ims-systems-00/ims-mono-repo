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
  );
};

export default AnalyticalAssistant;
