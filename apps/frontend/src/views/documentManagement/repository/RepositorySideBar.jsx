import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import AboutDocument from "./AboutDocument";
import DocumentActivity from "./DocumentActivity";
import useRepository from "./store/useRepository";
import React from "react";
import { Card } from "@ims-systems-00/ims-ui-kit";
import Box from "@/components/Box/Index";
const RepositorySideBar = ({ ...props }) => {
  const { detailsOfSelectedChild } = useRepository();
  return (
    <React.Fragment>
      {detailsOfSelectedChild && (
        <span className="text-secondary font-size-subtitle-2">
          <span className="text-primary">
            {detailsOfSelectedChild?.reference}
          </span>{" "}
          selected
        </span>
      )}
      <Panels defaultPanel={"About"} navLinks={["About", "Activities"]}>
        <Panel panelId="About">
          <Box varient="secondary-extra-light" noShadow>
            <AboutDocument {...props} />
          </Box>
        </Panel>
        <Panel panelId="Activities">
          <DocumentActivity {...props} />
        </Panel>
      </Panels>
    </React.Fragment>
  );
};

export default RepositorySideBar;
