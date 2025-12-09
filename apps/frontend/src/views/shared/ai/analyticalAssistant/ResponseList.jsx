import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { useAnalyticalAssistant } from "./store";

const ResposeList = () => {
  const { savedResponses, clearAnalysis, visitSavedResponse } =
    useAnalyticalAssistant();
  return (
    <React.Fragment>
      <DrawerOpener drawerId="analyise-report">
        <Button block color="primary" className="my-2" onClick={clearAnalysis}>
          Conduct analysis
        </Button>
      </DrawerOpener>
      {savedResponses.map((response) => {
        return (
          <div className="p-2 my-2 rounded-2 bg-light" key={response?._id}>
            <DrawerOpener drawerId="analyised-report">
              <Link to="#" onClick={() => visitSavedResponse(response)}>
                <img
                  src={
                    response?.created?.by?.profileImage ||
                    "https://assets.imssystems.tech/images/system/avatar-placeholder.jpg"
                  }
                  alt="avatar"
                  className="avatar-sm me-2 border"
                />
                Analysis conducted by {response?.created?.by?.name} on{" "}
                {moment(response.createdAt).format("DD/MM/YYYY HH:MM")}{" "}
              </Link>
            </DrawerOpener>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default ResposeList;
