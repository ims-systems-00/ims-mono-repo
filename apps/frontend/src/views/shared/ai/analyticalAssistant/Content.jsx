import Loading from "@/components/Loader/Loading";
import { DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import TaskForm from "@/views/taskManagement/TaskForm";
import Analyser from "./Analyser";
import ConductedReportView from "./ConductedReportView";
import EmptyList from "./EmptyList";
import ResposeList from "./ResponseList";
import { USER_ACTIONS, useAnalyticalAssistant } from "./store";
import { useTask } from "@/views/taskManagement/store";
const Content = () => {
  const {
    template,
    source,
    selectedContentsInAResponse,
    selectContentsInAResponse,
    savedResponses,
    processing,
    onCreateNewTask,
  } = useAnalyticalAssistant();
  const { handleCreateTask } = useTask();
  const { toggle } = useDrawer();
  if (!template)
    return (
      <p className="text-warning text-center my-4">
        Waiting for template to initiate.
      </p>
    );
  return (
    <div className="my-3">
      {processing[USER_ACTIONS.LIST_AI_RESPONSE].status ? (
        <Loading />
      ) : !savedResponses.length ? (
        <EmptyList />
      ) : (
        <ResposeList />
      )}
      <DrawerRight drawerId="analyise-report">
        <Analyser />
      </DrawerRight>
      <DrawerRight drawerId="analyised-report">
        <ConductedReportView />
      </DrawerRight>
      <DrawerRight
        drawerId="ai-task-create-form"
        onDrawerClose={() => {
          selectContentsInAResponse("");
        }}
      >
        {selectedContentsInAResponse && (
          <TaskForm
            drawerView
            module={source.module}
            moduleType={source.moduleType}
            defaultPopulation={{ description: selectedContentsInAResponse }}
            onSubmit={async (data) => {
              await handleCreateTask(data);
              toggle("ai-task-create-form");
              onCreateNewTask(data);
            }}
          />
        )}
      </DrawerRight>
    </div>
  );
};

export default Content;
