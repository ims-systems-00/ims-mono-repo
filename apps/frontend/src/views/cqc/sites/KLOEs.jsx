import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import SiteToolTable from "./SiteToolTable";
const KLOESECTIONS = ["Safe", "Effective", "Caring", "Responsive", "Well led"];
const KLOEs = ({ tool, processing, dispatch, overview, setTool, ...rest }) => {
  return (
    <>
      <div className="content">
        <Panels navLinks={KLOESECTIONS} defaultPanel={KLOESECTIONS[0]}>
          <h4>CQC Compliance</h4>
          {KLOESECTIONS.map((kloe) => (
            <Panel panelId={kloe}>
              <ErrorHandlerComponent
                hasError={processing.error}
                errorMessage="This Tool has been deleted or removed"
              >
                <SiteToolTable
                  dataTable={tool.filter(
                    (toolControl) => toolControl.control.clause[0] === kloe[0]
                  )}
                  overview={overview}
                  processing={processing}
                  dispatch={dispatch}
                  pathname={`/admin/cqc/controls`}
                  setTool={setTool}
                  {...rest}
                />
              </ErrorHandlerComponent>
            </Panel>
          ))}
        </Panels>
      </div>
    </>
  );
};

export default KLOEs;
