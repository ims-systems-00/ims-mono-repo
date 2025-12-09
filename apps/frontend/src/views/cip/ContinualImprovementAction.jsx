// import TooltipButton from "@/components/Tooltip/TooltipButton";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAlerts from "@/hooks/useAlerts";
import {
  Card,
  DrawerOpener,
  DrawerRight,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import { useCip } from "./store";
import useAccess from "@/hooks/useAccess";
import authCompliance from "@/utils/complianceAuthCheck";
import SearchableCompliance from "@/views/compliance/searchableList/components/Index";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";

const ContinualImprovementAction = () => {
  let {
    visitingCip: cip,
    nudgeCip,
    controlsOnVisitingCip,
    linkISOControl,
    removeISOControl,
    reloadCip,
  } = useCip();
  let { handleCreateTask } = useTask();
  let { alert, warningWithConfirmMessage } = useAlerts();
  let { authUser } = useAccess();
  let { closeDrawer } = useDrawer();
  return (
    <Card className="shadow-none">
      {alert}
      <div className="d-flex justify-content-center align-items-center p-3">
        <TooltipButton
          onClick={(e) => {
            // if (!cip.owner) {
            //   notify("OFI owner is not assigned", "danger");
            //   return;
            // }
            warningWithConfirmMessage(
              `${cip?.owner?.name} will be nudged to look at ${cip?.reference} ${cip?.title}`,
              () => {
                nudgeCip(cip);
              }
            );
          }}
          tooltip={
            new Date(cip.nextNudgeAt) > new Date()
              ? `Already nudged ${cip.owner?.name}`
              : `Nudge ${cip.owner?.name}`
          }
          color="link"
          className="border border-0 btn-link-primary"
          size="lg"
          name="nudge"
          id="nudge"
        >
          <i className="ims-icons-20 icon-icon-nudge-24" />
        </TooltipButton>
        {authUser(authCompliance()) && (
          <DrawerOpener drawerId="compliance-control-picker">
            <TooltipButton
              size="lg"
              name="nudge"
              id="nudge"
              color="link"
              tooltip="Select Compliance Control(s)"
              className="btn-link-primary"
            >
              <i className="ims-icons-20 icon-icon-shieldcheck-24" />
            </TooltipButton>
          </DrawerOpener>
        )}
        <DrawerOpener drawerId="add-task-form">
          <TooltipButton
            size="lg"
            name="nudge"
            id="nudge"
            color="link"
            tooltip="Link task"
            className="btn-link-primary"
          >
            <i className="ims-icons-20 icon-icon-notepad-24" />
          </TooltipButton>
        </DrawerOpener>
      </div>
      <DrawerRight drawerId="compliance-control-picker">
        <SearchableCompliance
          onNewSelection={(data) =>
            linkISOControl({
              controls: [data?.control?._id],
              toolkits: [],
            })
          }
          onDeselection={(data) => {
            removeISOControl({
              controls: [data?.control?._id],
              toolkits: [],
            });
          }}
          preSelectedControls={controlsOnVisitingCip}
        />
      </DrawerRight>

      <DrawerRight drawerId="add-task-form">
        {cip && (
          <TaskForm
            drawerView={true}
            module={cip._id}
            moduleType="cips"
            onSubmit={async (data) => {
              await handleCreateTask(data);
              closeDrawer("add-task-form");
              reloadCip();
            }}
          />
        )}
      </DrawerRight>
    </Card>
  );
};

export default ContinualImprovementAction;
