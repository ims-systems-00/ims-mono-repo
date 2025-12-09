import React from "react";
import { Badge } from "@ims-systems-00/ims-ui-kit";
import statuses from "./statuses";
const BadgeStatus = ({ status }) => {
  const selectedStatus = statuses.find(
    (currentStatus) => currentStatus.status === status
  );
  return (
    <Badge color="" fade={selectedStatus?.fade}>
      <i className={`${selectedStatus?.icon}  me-1 p-0 font-size-subtitle-2`} />{" "}
      {status}
    </Badge>
  );
};

export default BadgeStatus;
