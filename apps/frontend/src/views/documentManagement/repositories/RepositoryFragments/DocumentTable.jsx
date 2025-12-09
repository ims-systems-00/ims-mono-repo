import attachment_placeholder from "@/assets/img/attachment-placeholder.png";
import docx_placeholder from "@/assets/img/docx-placeholder.png";
import folder_placeholder from "@/assets/img/folder.svg";
import jpg_placeholder from "@/assets/img/jpg-placeholder.png";
import pdf_placeholder from "@/assets/img/pdf-placeholder.png";
import png_placeholder from "@/assets/img/png-placeholder.png";
import pptx_placeholder from "@/assets/img/pptx-placeholder.png";
import xlsx_placeholder from "@/assets/img/xlsx-placeholder.png";
import classNames from "classnames";
import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { truncateMiddle } from "@/utils/truncate";
import emptyRepository from "../../../../assets/img/empty-repository.png";
import emptyTrash from "../../../../assets/img/empty-trash.png";
import useRepository from "../store/repository/useRepository";

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

const DocumentTable = ({
  handleDocData = () => {},
  selectedRow = {},
  handleOptionsClick = () => {},
  isMoveDropdownOpen = false,
  processing = [],
  dispatch = () => {},
  handleFilter = () => {},
  tablePanel = "",
  repoId = "",
  showTrash = false,
  ...props
}) => {
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

  const _checkActiveRow = (nodeId) => {
    if (selectedRow?._id === nodeId) {
      return true;
    }
    return false;
  };

  const { loadChildDetails, visitingNodeChildren, visitNode } = useRepository();
  return (
    <div className="doc-table-container mb-lg-3 rounded">
      {visitingNodeChildren?.length > 0 ? (
        <div className="doc-table-wrapper">
          <Table className="doc-table" hover>
            <thead>
              <tr>
                <th>
                  <i className="fa-solid fa-arrow-up-long"></i>
                  <i className="fa-solid fa-arrow-down-long me-2"></i>
                  Name
                </th>
                <th>
                  <i className="fa-solid fa-arrow-up-long"></i>
                  <i className="fa-solid fa-arrow-down-long me-2"></i>
                  Created by
                </th>
                <th>
                  <i className="fa-solid fa-arrow-up-long"></i>
                  <i className="fa-solid fa-arrow-down-long me-2"></i>
                  Created ON
                </th>
                <th>
                  <i className="fa-solid fa-arrow-up-long"></i>
                  <i className="fa-solid fa-arrow-down-long me-2"></i>
                  File Size
                </th>
              </tr>
            </thead>
            <tbody>
              {visitingNodeChildren.length > 0
                ? visitingNodeChildren.map((node, index) => {
                    return (
                      <>
                        <tr
                          className={classNames("doc-row", {
                            "doc-row-odd": index % 2 === 0,
                            "doc-row-even": index % 2 !== 0,
                            "active-doc-row": _checkActiveRow(node?._id),
                          })}
                          key={node?._id}
                          onClick={(event) => {
                            if (tablePanel === "") {
                              if (!isMoveDropdownOpen) {
                                handleOptionsClick(event);
                                loadChildDetails(node);
                              }
                            } else if (
                              tablePanel === "Authorisation Requests"
                            ) {
                              history.push(
                                `/admin/document-repositories/${repoId}/nodes/${node?._id}/authorisation`
                              );
                            }
                          }}
                        >
                          <td>
                            <span id="doc-name">
                              <img
                                onClick={() => {
                                  if (!isMoveDropdownOpen) {
                                    visitNode(node._id);
                                  }
                                }}
                                id="doc-img"
                                className="me-3 doc-img"
                                src={_extractImageFromExtension(
                                  node?.type,
                                  node?.name
                                )}
                                alt="..."
                              />
                              <span className="doc-identifier">
                                <span
                                  onClick={() => {
                                    if (!isMoveDropdownOpen) {
                                      visitNode(node._id);
                                    }
                                  }}
                                  id="doc-identifier"
                                >
                                  {node?.type === "document"
                                    ? truncateMiddle(node?.name)
                                    : node?.name}
                                </span>
                              </span>
                            </span>
                          </td>
                          <td>
                            <span className="ml-4">
                              {node?.created?.by?.name}
                            </span>
                          </td>
                          <td>
                            <span className="ml-4">
                              {moment(node?.created?.on).format("DD/MM/YYYY")}
                            </span>
                          </td>
                          <td>
                            <span className="ml-5">
                              {node?.fileSize || "-"}
                            </span>
                          </td>
                        </tr>
                      </>
                    );
                  })
                : null}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="d-flex justify-content-center py-5">
          <img src={!showTrash ? emptyRepository : emptyTrash} alt="" />
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
