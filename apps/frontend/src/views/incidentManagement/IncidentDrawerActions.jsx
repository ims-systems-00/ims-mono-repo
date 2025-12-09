import Loading from "@/components/Loader/Loading";
import PopAlert from "@/components/PopAlert/PopAlert";
import useAccess from "@/hooks/useAccess";
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
import { useIncident } from "./store";
import useAlerts from "@/hooks/useAlerts";

const IncidentDrawerActions = ({ ...props }) => {
  let {
    processing,
    nudgeIncident,
    escalateIncident,
    visitingIncident: incident,
    popAction,
    handlePopAction,
    isResolvedIncident,
  } = useIncident();
  let { authUser } = useAccess();
  let { alert, warningWithConfirmMessage } = useAlerts();

  return (
    <React.Fragment>
      {alert}
      <UncontrolledDropdown>
        <DropdownToggle
          id="incident-actions"
          outline
          className="shadow-none border-0  "
          size="sm"
        >
          <i className="fa-solid fa-ellipsis-h"></i>
        </DropdownToggle>
        <DropdownMenu>
          {incident ? (
            !isResolvedIncident() ? (
              <React.Fragment>
                <DropdownItem
                  size="lg"
                  name="nudge"
                  id="nudge"
                  color="link"
                  className="btn-link-primary"
                  tooltip={
                    new Date(incident.nextNudgeAt) > new Date()
                      ? `Already nudged ${incident.owner?.name}`
                      : `Nudge ${incident.owner?.name}`
                  }
                  onClick={(e) => {
                    warningWithConfirmMessage(
                      `Owner of the incident will be nudged to look at ${incident.reference} ${incident.title}`,
                      () => {
                        nudgeIncident(incident);
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
                      incident?.escalated?.status
                        ? "Already escalated"
                        : "Escalate"
                    }
                    className="btn-link-danger"
                    onClick={(e) => {
                      warningWithConfirmMessage(
                        "This incident will be escalated",
                        () => {
                          escalateIncident(incident);
                        }
                      );
                    }}
                  >
                    {processing[USER_ACTIONS.ESCALATE_INCIDENT].status &&
                    processing[USER_ACTIONS.ESCALATE_INCIDENT].id ===
                      incident._id ? (
                      <Spinner size="sm" />
                    ) : incident?.escalated?.status ? (
                      "Already escalated"
                    ) : (
                      "Escalate"
                    )}
                  </DropdownItem>
                )}
              </React.Fragment>
            ) : (
              <DropdownItem disabled>
                <i className="fa-solid fa-check-circle me-2"></i> Resolved
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

export default IncidentDrawerActions;
