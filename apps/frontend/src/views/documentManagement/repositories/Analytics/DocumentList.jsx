import SimpleTable from "@/components/SimpleTable/SimpleTable";
import {
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { useHistory } from "react-router-dom";
import { useDocumentAnalytics } from "./store";
import emptyRepository from "@/assets/img/empty-repository.png";
import { extractImageFromExtension } from "@/utils/extractImageFromExtension";

const DocumentList = () => {
  let { overviewDocuments } = useDocumentAnalytics();
  const history = useHistory();
  return (
    <React.Fragment>
      <div className="justify-content-start mb-3">
        <Button onClick={() => history.push("/admin/document-repositories")}>
          <i className="fa-solid fa-arrow-left" />
          {"  "}Back to overview
        </Button>
      </div>
      {overviewDocuments?.length > 0 ? (
        <Card>
          <SimpleTable
            linear
            striped
            active
            thead={[
              {
                text: "Name",
                className: "",
              },
              {
                text: "Owner",
                className: "",
              },
              {
                text: "Date",
                className: "",
              },
              {
                text: "Actions",
                className: "",
              },
            ]}
            tbody={overviewDocuments.map((node) => {
              return {
                onRowClick: function () {
                  //   loadChildDetails(node);
                },
                data: [
                  {
                    item: (
                      <span id="doc-name cursor-pointer">
                        <img
                          id="doc-img"
                          className="me-3 doc-img"
                          src={extractImageFromExtension(
                            node?.type,
                            node?.name
                          )}
                          alt="..."
                        />
                        <span
                          to={"#"}
                          onClick={() => {
                            if (node.type === "document")
                              history.push(
                                `/admin/document-repositories/${
                                  node?.repository?._id || node?.repository
                                }/nodes/${node?._id}`
                              );
                          }}
                        >
                          {node?.name}
                        </span>
                      </span>
                    ),
                  },
                  {
                    item: node?.created?.by?.name,
                  },
                  {
                    item: moment(node?.created?.on).format("DD/MM/YYYY"),
                  },
                ],
                actions: (
                  <UncontrolledDropdown size="sm" direction="right">
                    <DropdownToggle
                      outline
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      data-display="static"
                    >
                      <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={(e) => {
                          e.stopPropagation();
                          history.push(
                            `/admin/document-repositories/${
                              node?.repository?._id || node?.repository
                            }/nodes/${node?._id}`
                          );
                        }}
                        id="detail"
                        tooltip="View Details"
                      >
                        View document
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                ),
              };
            })}
          />
        </Card>
      ) : (
        <div className="d-flex justify-content-center py-5">
          <img src={emptyRepository} alt="" />
        </div>
      )}
    </React.Fragment>
  );
};

export default DocumentList;
