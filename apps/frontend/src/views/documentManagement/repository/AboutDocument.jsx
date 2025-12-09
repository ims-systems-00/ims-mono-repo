import { Badge, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment/moment";
import { capitalize } from "@/utils/capitalize";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import useRepository from "./store/useRepository";
import React from "react";

const AboutDocument = ({}) => {
  const { repository, detailsOfSelectedChild } = useRepository();
  return (
    <>
      {detailsOfSelectedChild ? (
        <Table borderless className="">
          <tbody>
            <tr>
              <td className="w-50">Reference</td>
              <td>{detailsOfSelectedChild?.reference}</td>
            </tr>
            <tr>
              <td>
                {detailsOfSelectedChild?.type === "folder"
                  ? "Folder"
                  : "Document"}{" "}
                Name
              </td>
              <td className="doc-name">{detailsOfSelectedChild?.name}</td>
            </tr>
            {detailsOfSelectedChild?.type !== "folder" && (
              <tr>
                <td>Document Version</td>
                <td className="doc-name">
                  {detailsOfSelectedChild?.documentData?.dvID}
                </td>
              </tr>
            )}
            <tr>
              <td>Created By</td>
              <td>
                <ImageNameWrapper
                  img={detailsOfSelectedChild?.created?.by?.profileImageSrc}
                  name={detailsOfSelectedChild?.created?.by?.name}
                />
              </td>
            </tr>
            <tr>
              <td>Created Date</td>
              <td>
                {moment(detailsOfSelectedChild?.created?.on).format("LL")}
              </td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{capitalize(detailsOfSelectedChild?.type)}</td>
            </tr>
            {detailsOfSelectedChild?.type !== "folder" && (
              <tr>
                <td>Purpose</td>
                <td>
                  {capitalize(detailsOfSelectedChild?.documentData?.purpose)}
                </td>
              </tr>
            )}
            <tr>
              <td>Status</td>
              <td
                className={
                  detailsOfSelectedChild?.status === "Pending"
                    ? "text-warning"
                    : "text-primary"
                }
              >
                {detailsOfSelectedChild?.status}
              </td>
            </tr>
            <tr>
              <td>Modified By</td>
              <td>
                <ImageNameWrapper
                  img={detailsOfSelectedChild?.created?.by?.profileImageSrc}
                  name={detailsOfSelectedChild?.created?.by?.name}
                />
              </td>
            </tr>
            <tr>
              <td>Modified Date</td>
              <td>
                {moment(
                  detailsOfSelectedChild?.type === "folder"
                    ? detailsOfSelectedChild?.folderData?.modified?.on
                    : detailsOfSelectedChild?.documentData?.modified?.on
                ).format("LL")}
              </td>
            </tr>
            {detailsOfSelectedChild?.documentData && (
              <tr>
                <td>Document Owner(s)</td>
                <td>
                  {detailsOfSelectedChild?.documentData?.owners.map((owner) => (
                    <React.Fragment>
                      <ImageNameWrapper
                        name={owner.name}
                        img={owner.profileImageSrc}
                      />
                      <br></br>
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            )}
            {detailsOfSelectedChild?.folderData && (
              <tr>
                <td>Folder Owner(s)</td>
                <td>
                  {repository?.owners?.length > 0 &&
                    repository?.owners?.map((owner) => (
                      <React.Fragment>
                        <ImageNameWrapper
                          name={owner.name}
                          img={owner.profileImageSrc}
                        />
                        <br></br>
                      </React.Fragment>
                    ))}
                </td>
              </tr>
            )}
            {detailsOfSelectedChild?.documentData?.applicableModules?.length >
              0 && (
              <tr>
                <td>Linked Modules</td>
                <td>
                  {detailsOfSelectedChild.documentData?.applicableModules.map(
                    (applicableModule) => (
                      <Badge color={"primary"}>
                        {applicableModule === "compliancecontrols"
                          ? "Compliance"
                          : applicableModule}{" "}
                      </Badge>
                    )
                  )}
                </td>
              </tr>
            )}
            {detailsOfSelectedChild?.documentData?.complianceTools.length >
              0 && (
              <tr>
                <td>Compliance tools</td>
                <td>
                  {detailsOfSelectedChild?.documentData.complianceTools.map(
                    (complianceTool) => (
                      <Badge color={"primary"}>{complianceTool} </Badge>
                    )
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        <span className="text-center">Click on a row to view details</span>
      )}
    </>
  );
};

export default AboutDocument;
