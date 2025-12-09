import React from "react";
import { Card, CardHeader } from "@ims-systems-00/ims-ui-kit";

const DetailsSidebar = ({ title, label, children }) => {
  return (
    <React.Fragment>
      {/* <Card className="border-0 fixed-layout shadow-none pt-5">
        <CardHeader className="bg-transparent">
          <h4 className="text-white mt-2 mb-0">{title}</h4>
          <p className="text-white mb-0">{label}</p>
        </CardHeader>
      </Card> */}
      <div className="mb-4">{children}</div>
    </React.Fragment>
  );
};
<></>;
export default DetailsSidebar;
