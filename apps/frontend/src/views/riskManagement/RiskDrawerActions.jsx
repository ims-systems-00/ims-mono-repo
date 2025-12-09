import Loading from "@/components/Loader/Loading";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import USER_ACTIONS from "./actions";
import { useRisk } from "./store";

const RiskDrawerActions = ({ ...props }) => {
  let {
    processing,
    nudgeRisk,
    escalateRisk,
    visitingRisk: risk,
    action,
    handleAction,
  } = useRisk();
  let { authUser } = useAccess();
  let { alert, warningWithConfirmMessage } = useAlerts();

  return (
    <React.Fragment>
      {alert}
      <UncontrolledDropdown>
        <DropdownToggle
          id="risk-actions"
          outline
          className="shadow-none border-0  "
          size="sm"
        >
          <i className="fa-solid fa-ellipsis-h"></i>
        </DropdownToggle>
        <DropdownMenu>
          {risk ? (
            !risk?.mitigated.status ? (
              <React.Fragment>
                <DropdownItem
                  size="lg"
                  name="nudge"
                  id="nudge"
                  color="link"
                  className="btn-link-primary"
                  tooltip={
                    new Date(risk.nextNudgeAt) > new Date()
                      ? `Already nudged ${risk.owner?.name}`
                      : `Nudge ${risk.owner?.name}`
                  }
                  onClick={(e) => {
                    warningWithConfirmMessage(
                      `${risk?.owner?.name} will be nudged to look at ${risk?.reference}`,
                      () => {
                        nudgeRisk(risk);
                      }
                    );
                  }}
                >
                  Nudge
                </DropdownItem>

                {authUser({
                  service: IMS_SERVICES.RISK_MANAGEMENT,
                  action: ACTIONS.DELETE,
                  effect: EFFECTS.ALLOW,
                }) && (
                  <DropdownItem
                    size="lg"
                    color="link"
                    name="escalate"
                    id="escalate"
                    tooltip={
                      risk?.escalated?.status ? "Already escalated" : "Escalate"
                    }
                    className="btn-link-danger"
                    onClick={(e) => {
                      warningWithConfirmMessage(
                        "This risk will be escalated",
                        () => {
                          escalateRisk(risk);
                        }
                      );
                    }}
                  >
                    {processing[USER_ACTIONS.ESCALATE_RISK].status &&
                    processing[USER_ACTIONS.ESCALATE_RISK].id === risk._id ? (
                      <Spinner size="sm" />
                    ) : risk?.escalated?.status ? (
                      "Already escalated"
                    ) : (
                      "Escalate"
                    )}
                  </DropdownItem>
                )}
              </React.Fragment>
            ) : (
              <DropdownItem disabled>
                <i className="fa-solid fa-check-circle me-2"></i> Mitigated
              </DropdownItem>
            )
          ) : (
            <Loading />
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );
};

export default RiskDrawerActions;
