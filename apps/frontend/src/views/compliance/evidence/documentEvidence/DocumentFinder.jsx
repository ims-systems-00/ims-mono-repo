import React, { useState } from "react";
import { useGetDocumentTrees } from "../../hooks/useGetDocumentTrees";
import SearchInput from "@/components/SearchInput/search-input";
import { Pagination } from "@/components/Pagination/pagination";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import { extractImageFromExtension } from "@/utils/extractImageFromExtension";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import { useLinkDocumemtTreeEvidence } from "../../hooks/useLinkDocumentTreeEvidence";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { draftJSToText } from "@/utils/draftJsToText";

export const DocumentFinder = ({ clause }) => {
  const { isOpen, toggle } = useDualStateController();
  const [selected, setSelected] = useState("");
  const { nodes, queryHandlers, pagination } = useGetDocumentTrees();
  const { linkDocumentTreeEvidence, isPending } = useLinkDocumemtTreeEvidence();

  return (
    <div className="pt-3">
      <>
        <SearchInput queryHandlers={queryHandlers} />

        {nodes?.length === 0 ? (
          <div className="text-center mt-3 text-gray-500 italic">
            No document trees found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {nodes?.map((node) => {
              return (
                <div key={node?._id} className="border rounded-3 p-3 mt-3">
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="d-flex gap-2 mb-2 align-items-center">
                      <img
                        src={extractImageFromExtension(node?.type, node?.name)}
                        alt="..."
                      />
                      <h6>{node?.name}</h6>
                    </div>
                    <div className="ml-auto">
                      <TooltipButton
                        style={{ cursor: "pointer" }}
                        tooltip="Link Document"
                        onClick={(e) => {
                          setSelected(node?._id);
                          toggle();
                        }}
                        name="plus"
                        size="sm"
                        id="plus"
                        color="link"
                        className="btn-link-primary border border-0"
                      >
                        <i className="ims-icons-20 icon-icon-plus-24" />
                      </TooltipButton>
                    </div>
                  </div>

                  <BadgeStatus status={node?.status} />

                  <p className="mt-3 mb-2">
                    <span className="text-black font-medium">Description:</span>{" "}
                    <span className="font-semibold">
                      {draftJSToText(node?.repository?.description)}
                    </span>
                  </p>
                </div>
              );
            })}

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={pagination?.totalResults}
              currentPage={pagination?.currentPage || 1}
              onPageChange={(page) => queryHandlers.handlePagination(page)}
              size={pagination?.size}
            />
          </div>
        )}
      </>

      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <h5 className="text-danger mt-2 mb-3">{`You are about to link this document to ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              This document will be classed as an evidence of implementation of
              this clause when auditors are auditing your organisation.
            </p>
          </Alert>

          <div className="text-center mt-2 d-flex justify-content-end gap-2">
            <Button onClick={toggle} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                linkDocumentTreeEvidence(clause?._id, {
                  evidenceType: "document-management",
                  relatedDocument: selected,
                });
                toggle();
              }}
              className="bg-primary text-white"
            >
              {isPending ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
