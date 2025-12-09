import PopAlert from "@/components/PopAlert/PopAlert";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useCip } from "./store";

const CipDrawerActions = ({ ...props }) => {
  let { nudgeCip, visitingCip: cip, popAction, handlePopAction } = useCip();

  return (
    <React.Fragment>
      <UncontrolledDropdown>
        <DropdownToggle
          id="cip-actions"
          outline
          className="shadow-none border-0  "
          size="sm"
        >
          <i className="fa-solid fa-ellipsis-h"></i>
        </DropdownToggle>
        <DropdownMenu>
          <React.Fragment>
            <DropdownItem
              onClick={(e) => {
                e.stopPropagation();
                handlePopAction("nudge");
              }}
              name="nudge"
              id="nudge"
              tooltip={
                new Date(cip?.nextNudgeAt) > new Date()
                  ? `Already nudged ${cip?.owner?.name}`
                  : `Nudge ${cip?.owner?.name}`
              }
            >
              Nudge
            </DropdownItem>
          </React.Fragment>
        </DropdownMenu>
      </UncontrolledDropdown>
      {cip && (
        <React.Fragment>
          <PopAlert
            target="cip-actions"
            openState={popAction === "nudge" ? "nudge" : ""}
            handleOpenState={handlePopAction}
            onCancel={() => handlePopAction("")}
            onConfirm={() => {
              nudgeCip(cip);
              handlePopAction("");
            }}
            confirmText="Are you sure?"
            message={`Assignee for the cip will be nudged to look at ${cip.reference} ${cip.title}`}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CipDrawerActions;
