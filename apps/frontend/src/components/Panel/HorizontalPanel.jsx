import { Col, Row, TabContent, TabPane } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import PanelNavigation from "./PanelNaviation";

const useTabs = (initialValue) => {
  const [horizontalTabs, sethorizontalTabs] = React.useState(initialValue);
  // with this function we change the active tab for all the tabs in a page...
  const changeActiveTab = (e, tabName) => {
    e.preventDefault();
    sethorizontalTabs(tabName);
  };
  return [horizontalTabs, changeActiveTab];
};

export const Panels = ({
  cardPlain = false,
  defaultPanel,
  navLinks,
  backLinks,
  children,
  isModalOpen,
}) => {
  const [horizontalTabs, changeActiveTab] = useTabs(defaultPanel);
  const [containsTable, setContainsTable] = React.useState(false);
  return (
    <Row>
      <Col md="12">
        <PanelNavigation
          navLinks={navLinks}
          backLinks={backLinks}
          horizontalTabs={horizontalTabs}
          changeActiveTab={changeActiveTab}
        />
        <TabContent className="mt-1" activeTab={horizontalTabs}>
          {children}
        </TabContent>
      </Col>
    </Row>
  );
};

export const Panel = ({ panelId, children }) => {
  return <TabPane tabId={panelId}>{children}</TabPane>;
};
