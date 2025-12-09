import classNames from "classnames";
import React from "react";

const VerticalActiveBar = ({
  slideMenuDetails,
  activeSidebarItem,
  activeCollapseSidebarItem,
  ...props
}) => {
  return (
    <React.Fragment>
      {slideMenuDetails.name
        ? props.name === slideMenuDetails.name && (
            <div
              className={classNames("", {
                "active-ims-sidebar":
                  props.name === slideMenuDetails.name ||
                  activeSidebarItem(props.layout + props.path),
              })}
            ></div>
          )
        : !props.collapse
        ? activeSidebarItem(props.layout + props.path) && (
            <div
              className={classNames("", {
                "active-ims-sidebar":
                  props.name === slideMenuDetails.name ||
                  activeSidebarItem(props.layout + props.path),
              })}
              s
            ></div>
          )
        : props.collapse
        ? activeCollapseSidebarItem(props.views) && (
            <div
              className={classNames("", {
                "active-ims-sidebar":
                  props.name === slideMenuDetails.name ||
                  activeCollapseSidebarItem(props.views),
              })}
            ></div>
          )
        : ""}
    </React.Fragment>
  );
};

export default VerticalActiveBar;
