import attachment_placeholder from "@/assets/img/attachment-placeholder.png";
import docx_placeholder from "@/assets/img/docx-placeholder.png";
import emptyRepository from "@/assets/img/empty-repository.png";
import folder_placeholder from "@/assets/img/folder.svg";
import jpg_placeholder from "@/assets/img/jpg-placeholder.png";
import pdf_placeholder from "@/assets/img/pdf-placeholder.png";
import png_placeholder from "@/assets/img/png-placeholder.png";
import pptx_placeholder from "@/assets/img/pptx-placeholder.png";
import xlsx_placeholder from "@/assets/img/xlsx-placeholder.png";
import SimpleTable from "@/components/SimpleTable/SimpleTable";
import useAccess from "@/hooks/useAccess";
import { Card } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { useHistory } from "react-router-dom";
import NodeActions from "./Nodeactions";
import useRepository from "./store/useRepository";

const placeholder = new Map();
placeholder.set("pdf", pdf_placeholder);
placeholder.set("png", png_placeholder);
placeholder.set("jpg", jpg_placeholder);
placeholder.set("jpeg", jpg_placeholder);
placeholder.set("ppt", pptx_placeholder);
placeholder.set("pptx", pptx_placeholder);
placeholder.set("doc", docx_placeholder);
placeholder.set("docx", docx_placeholder);
placeholder.set("xls", xlsx_placeholder);
placeholder.set("xlsx", xlsx_placeholder);
placeholder.set("csv", xlsx_placeholder);

function prepareOwnersForTable(repository, node) {
  let folderOwners = Array.from(
    new Set([
      repository?.created?.by?._id,
      ...repository?.owners?.map((o) => o._id),
    ])
  );
  if (node.type === "folder")
    return (
      repository?.created?.by?.name +
      (folderOwners?.length - 1 > 0 ? `+${folderOwners?.length - 1}` : "")
    );
  if (node.type === "document")
    return (
      node?.created?.by?.name +
      (node?.documentData?.owners?.length - 1 > 0
        ? `+${node?.documentData?.owners?.length - 1}`
        : "")
    );
}

const NodeTable = ({}) => {
  const { visitNode, repository, visitingNodeChildren, loadChildDetails } =
    useRepository();
  function _extractImageFromExtension(type, name) {
    if (type === "document") {
      let splited = name.split(".");
      let extension = splited[splited.length - 1];
      extension = extension.toLowerCase();
      return placeholder.get(extension) || attachment_placeholder;
    }
    if (type === "folder") {
      return folder_placeholder;
    }
  }
  const history = useHistory();
  const { authUser } = useAccess();
  return (
    <React.Fragment>
      {visitingNodeChildren?.length > 0 ? (
        <SimpleTable
          linear
          striped
          active
          borderless
          thead={[
            {
              text: "Name",
              className: "",
            },
            {
              text: "Owner(s)",
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
          tbody={visitingNodeChildren.map((node) => {
            return {
              onRowClick: function () {
                loadChildDetails(node);
              },
              data: [
                {
                  item: (
                    <span id="doc-name cursor-pointer">
                      <img
                        onClick={() => {
                          if (node?.type === "folder") visitNode(node._id);
                        }}
                        id="doc-img"
                        className="me-3 doc-img"
                        src={_extractImageFromExtension(node?.type, node?.name)}
                        alt="..."
                      />
                      <span
                        to={"#"}
                        onClick={() => {
                          if (node.type === "folder") visitNode(node._id);
                          if (node.type === "document")
                            history.push(
                              `/admin/document-repositories/${
                                node?.repository?._id || node?.repository
                              }/nodes/${node?._id}`
                            );
                        }}
                      >
                        {node.reference} {node?.name}
                      </span>
                    </span>
                  ),
                },
                {
                  item: prepareOwnersForTable(repository, node),
                },
                {
                  item: moment(node?.created?.on).format("DD/MM/YYYY"),
                },
              ],
              actions: <NodeActions node={node} />,
            };
          })}
        />
      ) : (
        <div className="d-flex justify-content-center py-5">
          <img src={emptyRepository} alt="" />
        </div>
      )}
    </React.Fragment>
  );
};

export default NodeTable;
