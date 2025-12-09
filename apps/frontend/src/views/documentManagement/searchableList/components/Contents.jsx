import React from "react";
import Results from "./Results";
import Navigator from "./Navigator";
import useScrollTracker from "@/hooks/useScrollTracker";
import { useSearchableDocument } from "../store";
import Document from "./Document";
import { DrawerRight } from "@ims-systems-00/ims-ui-kit";

const Contents = ({}) => {
  let { visitNextPage, viewDocument } = useSearchableDocument();
  let [documentsPane, handleScroll] = useScrollTracker(null, {
    onBottomReached: (element) => {
      visitNextPage();
    },
  });
  return (
    <React.Fragment>
      <DrawerRight
        containerRef={documentsPane}
        onScroll={() => handleScroll()}
        drawerId="document-management"
      >
        <div className="searchable-document">
          <Navigator />
          <Results />
        </div>
      </DrawerRight>
      <DrawerRight
        size="55"
        drawerId="document-viewer"
        onDrawerClose={() => viewDocument(null)}
      >
        <Document />
      </DrawerRight>
    </React.Fragment>
  );
};

export default Contents;
