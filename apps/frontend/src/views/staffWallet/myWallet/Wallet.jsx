import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import { Card } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import ExpenseReports from "../expenseReport/ExpenseReports";
import Leaves from "../leaves/Leaves";
import WorkLogs from "../workLog/WorkLogs";
import { getCurrentSessionData } from "@/services/authService";

const Wallet = (props) => {
  let { authUser, authWalletAccess } = useAccess();
  let walletId = authWalletAccess(props.view?._id)
    ? props.view._id
    : getCurrentSessionData().user?._id;
  return (
    <div className="content">
      <Panels
        defaultPanel={"Expenses"}
        navLinks={
          authUser({
            service: IMS_SERVICES.INCIDENT_MANAGEMENT,
            action: ACTIONS.CREATE,
            effect: EFFECTS.ALLOW,
          }) && ["Expenses", "Leaves", "Work log"]
        }
      >
        <Panel panelId="Expenses">
          <Card>
            <ExpenseReports walletId={walletId} />
          </Card>
        </Panel>
        <Panel panelId="Leaves">
          <Card>
            <Leaves walletId={walletId} />
          </Card>
        </Panel>
        <Panel panelId="Work log">
          <Card>
            <WorkLogs walletId={walletId} />
          </Card>
        </Panel>
      </Panels>
    </div>
  );
};

export default Wallet;
