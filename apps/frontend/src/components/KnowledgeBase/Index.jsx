import {
  Button,
  DrawerContextProvider,
  DrawerOpener,
  DrawerRight,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";

const KB = () => {
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <Button
        block
        onClick={() => {
          closeDrawer("kb-drawer");
        }}
        className="border-0"
        outline
      >
        Hide Knowledge base
      </Button>
      <iframe
        className="scrollbar-primary"
        width="100%"
        height="100%"
        src={process.env.REACT_APP_KB_URL}
        frameborder="0"
      ></iframe>
    </React.Fragment>
  );
};
const KBEmbeded = ({}) => {
  return (
    <DrawerContextProvider>
      <DrawerOpener drawerId="kb-drawer">
        <Button color="primary" className="border-0 btn-icon" outline size="sm">
          <p className="font-size-subtitle-1">
            <i className="ims-icons-20 icon-icon-bookopen-24" />
          </p>
        </Button>
      </DrawerOpener>
      <DrawerRight drawerId="kb-drawer" noLayout size={50}>
        <KB />
      </DrawerRight>
    </DrawerContextProvider>
  );
};

export default KBEmbeded;
