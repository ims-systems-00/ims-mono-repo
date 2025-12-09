import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
const ProjectManagement = (props) => {
  return (
    <>
      <div className="content">
        <Panels defaultPanel={"Projects"} navLinks={["Projects"]}>
          <Panel panelId="Projects">
            <span className="text-center text-success font-size-subtitle-2">
              Project management is coming soon
            </span>
          </Panel>
        </Panels>
      </div>
    </>
  );
};

export default ProjectManagement;
