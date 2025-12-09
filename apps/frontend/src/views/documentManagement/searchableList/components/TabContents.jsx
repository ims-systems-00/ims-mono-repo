import React from "react";
import Results from "./Results";
import Navigator from "./Navigator";
import { useSearchableDocument } from "../store";
import Document from "./Document";
import { DrawerRight } from "@ims-systems-00/ims-ui-kit";

const TabContents = ({}) => {
  let { viewDocument } = useSearchableDocument();
  return (
    <>
      <div className="searchable-document">
        <Navigator />
        <Results />
      </div>
      <DrawerRight
        size="55"
        drawerId="document-viewer"
        onDrawerClose={() => viewDocument(null)}
      >
        <Document />
      </DrawerRight>
    </>
  );
};

export default TabContents;
