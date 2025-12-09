import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { downloadFile } from "@/services/fileHandlerService";
import useDocument from "./store/useDocument";
import ImageNameWrapper from "../../shared/DetailComponents/ImageNameWrapper";
import Box, { boxVarients } from "../../../components/Box/Index";
const MetaInformation = ({}) => {
  const { document, repository } = useDocument();
  return (
    <React.Fragment>
      <Box>
        <div className="border-bottom pb-1">
          <p className="font-weight-bold font-size-subtitle-1">
            Purpose: <span className="">{document?.documentData.purpose}</span>{" "}
            <Button
              size="sm"
              className="pull-right border-0"
              onClick={() => downloadFile(document?.documentData?.storageInfo)}
            >
              <i className="fa-solid fa-download" />
            </Button>
          </p>
        </div>
        <div className="py-2">
          <Box varient={boxVarients.secondaryExtraLight} noShadow>
            <h5>Document name</h5>
            <p>
              {document?.reference} {document?.name}
            </p>
          </Box>
          <Box varient={boxVarients.secondaryExtraLight} noShadow>
            <h5>Repository</h5>
            <Link
              to={`/admin/document-repositories/${document?.repository?._id}`}
            >
              {document?.repository?.name}
            </Link>
          </Box>
          <Row>
            <Col md="6">
              <Box varient={boxVarients.secondaryExtraLight} noShadow>
                <h5>Version control</h5>
                {document?.documentData?.dvID !== 0 && (
                  <p className="text-secondary">
                    V{document?.documentData?.dvID}
                  </p>
                )}{" "}
              </Box>
            </Col>
            <Col md="6">
              <Box varient={boxVarients.secondaryExtraLight} noShadow>
                <h5>Status</h5>
                <Badge
                  color={
                    document?.status === "Published" ? "primary" : "secondary"
                  }
                >
                  {document?.status}
                </Badge>
              </Box>
            </Col>
          </Row>
          <Box varient={boxVarients.secondaryExtraLight} noShadow>
            <h5>Other information</h5>
            <p>
              Document was uploaded on{" "}
              <b>
                <span className="text-dark">
                  {moment(document?.created?.on).format("DD/MM/YYYY")}
                </span>
              </b>
            </p>
            <p>
              <b>Audience</b>:{" "}
              <Badge color={"primary"}>
                {repository?.group?.name || repository?.privacy}
              </Badge>
            </p>
          </Box>

          {document?.documentData?.applicableModules.length > 0 && (
            <p>
              <b>Linked Modules</b>:{" "}
              {document.documentData.applicableModules.map(
                (applicableModule) => (
                  <Badge color={"primary"}>
                    {applicableModule === "compliancecontrols"
                      ? "Compliance"
                      : applicableModule}
                  </Badge>
                )
              )}
            </p>
          )}
          {document?.documentData?.complianceTools.length > 0 && (
            <p>
              <b>Compliance standards</b>:{" "}
              {document.documentData.complianceTools.map((complianceTool) => (
                <Badge color={"primary"}>{complianceTool}</Badge>
              ))}
            </p>
          )}
          <div className="border-bottom pb-1 mb-2">
            <p className="font-weight-bold font-size-subtitle-1 mt-3">
              Document owners:{" "}
            </p>
          </div>
          {document?.documentData?.owners.length > 0 && (
            <React.Fragment>
              {document.documentData.owners.map((owner) => (
                <React.Fragment>
                  <ImageNameWrapper
                    name={owner.name}
                    img={owner.profileImageSrc}
                  />
                  <br />
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
        </div>
      </Box>
    </React.Fragment>
  );
};

export default MetaInformation;
