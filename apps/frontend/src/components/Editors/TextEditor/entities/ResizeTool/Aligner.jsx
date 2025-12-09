import TooltipButton from "@/components/Tooltip/TooltipButton";
import React, { useCallback } from "react";
import { ENTITY_NAME } from "../entityNames";
const alignTools = [
  {
    label: "Align left",
    style: ENTITY_NAME.ALIGN_LEFT,
    icon: "fa-solid fa-align-left",
  },
  {
    label: "Align center",
    style: ENTITY_NAME.ALIGN_CENTER,
    icon: "fa-solid fa-align-justify",
  },
  {
    label: "Align right",
    style: ENTITY_NAME.ALIGN_RIGHT,
    icon: "fa-solid fa-align-right",
  },
];
export default function Aligner({ editorRef, onAlignmentChange, ...rest }) {
  let handleAlignment = useCallback(
    ({ alignment }) => {
      onAlignmentChange && onAlignmentChange({ alignment });
      let entityKey = rest.block.getEntityAt(0);
      rest.contentState.mergeEntityData(entityKey, { alignment: alignment });
    },
    [onAlignmentChange]
  );
  return (
    <div className="d-inline-block shadow-md rounded mb-1">
      {alignTools.map((tool) => {
        return (
          <TooltipButton
            tooltip={tool?.label}
            type="button"
            className={`btn  m-0 text-secondary`}
            key={tool?.style}
            onClick={(e) => handleAlignment({ alignment: tool?.style })}
          >
            {tool.icon ? <i className={tool.icon} /> : tool?.label}
          </TooltipButton>
        );
      })}
    </div>
  );
}
