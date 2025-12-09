import React from "react";
import TabContent from "./TabContent";

const Tabs = ({
  primaryBtn = "Primary",
  secondaryBtn = "Secondary",
  primaryTab,
  secondaryTab,
  ...props
}) => {
  const [tab, setTab] = React.useState("primary");
  return (
    <div className="tabs-container">
      <div className="tabs-buttons">
        <div
          className={`tab-button primary-tab ${
            tab === "primary" ? "active-tab" : "tab-cursor"
          }`}
          onClick={() => setTab("primary")}
        >
          {primaryBtn}
        </div>
        <div
          className={`tab-button secondary-tab ${
            tab === "secondary" ? "active-tab" : "tab-cursor"
          }`}
          onClick={() => setTab("secondary")}
        >
          {secondaryBtn}
        </div>
      </div>
      <TabContent>{tab === "primary" ? primaryTab : secondaryTab}</TabContent>
    </div>
  );
};

export default Tabs;
