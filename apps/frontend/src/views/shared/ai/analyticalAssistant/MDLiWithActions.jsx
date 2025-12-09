import React from "react";
import classNames from "classnames";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";
import { useAnalyticalAssistant } from "./store";
const extractTextNodes = (children) => {
  let textNodes = [];
  React.Children.forEach(children, (child) => {
    if (typeof child === "string") {
      textNodes.push(child);
    } else if (React.isValidElement(child)) {
      textNodes = textNodes.concat(extractTextNodes(child.props.children));
    }
  });
  return textNodes.join("\n");
};
export default function MDLiWithActions({
  node,
  inline,
  className,
  children,
  ...props
}) {
  const [sectionHovering, setSectionHovering] = useState(false);
  const [actionsHovering, setActionsHovering] = useState(false);
  const { selectContentsInAResponse } = useAnalyticalAssistant();
  return (
    <li
      onMouseOver={() => setSectionHovering(true)}
      onMouseLeave={() => setSectionHovering(false)}
      className={classNames(className, {})}
      {...props}
    >
      {children}
      <DrawerOpener drawerId="ai-task-create-form">
        <Button
          onMouseOver={() => setActionsHovering(true)}
          onMouseLeave={() => setActionsHovering(false)}
          onClick={() => selectContentsInAResponse(extractTextNodes(children))}
          color="primary"
          size="sm"
          className={classNames("border-0 my-3", {
            "d-none": !sectionHovering,
          })}
        >
          Create task <i className={"fa-solid fa-plus"}></i>
        </Button>
      </DrawerOpener>
    </li>
  );
}
