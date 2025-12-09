import BreadCrumb from "@/components/Breadcrumb/BreadCrumb";
import Can from "@/components/Can/Can";
import Loading from "@/components/Loader/Loading";
import { Button, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";
import AddNewDropdown from "./AddNewDropdown";
import MoreDropdown from "./MoreDropdown";
import USER_ACTIONS from "./store/actions";
import useRepository from "./store/useRepository";

const DocumentActions = ({}) => {
  const {
    processing,
    repository,
    visitingNodePath,
    visitNode,
    visitParentNode,
    isBinActive,
    backToNormalView,
    refreshCurretNodeChildrenList,
    isViewingAuthorisation,
    visitingNode,
  } = useRepository();
  let crumbs = visitingNodePath && [
    {
      name: repository?.reference + " root",
      nodeId: null,
    },
    ...visitingNodePath.map((node, key) => ({
      name: node.name,
      nodeId: node.nodeId,
    })),
  ];
  return (
    <Row className="d-flex justify-content-between align-items-center mb-2">
      <Col lg={8}>
        {processing[USER_ACTIONS.LOAD_NODE_PATH].status ? (
          <Loading text="Loading..." />
        ) : (
          <BreadCrumb
            onSelect={(nodeId) => {
              visitNode(nodeId);
            }}
            crumbs={crumbs}
            listTag={"div"}
          />
        )}
      </Col>
      <Col lg={4} className="d-flex justify-content-lg-end align-items-center">
        {isBinActive() || isViewingAuthorisation() ? (
          <Button size="sm" className="border-0 " onClick={backToNormalView}>
            <i className="fa-solid fa-table" /> Back to table
          </Button>
        ) : (
          <React.Fragment>
            {visitingNode && (
              <Button
                className="mx-1 border-0"
                onClick={() => visitParentNode()}
              >
                <i className="fa-solid fa-arrow-up-long" />
              </Button>
            )}
            <Button
              className="border-0 mx-1"
              onClick={refreshCurretNodeChildrenList}
            >
              <i className="fa-solid fa-rotate-right" />
            </Button>
            <Can
              policy={{
                service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                action: ACTIONS.CREATE,
              }}
            >
              <AddNewDropdown />
              <MoreDropdown />
            </Can>
          </React.Fragment>
        )}
      </Col>
    </Row>
  );
};

export default DocumentActions;
