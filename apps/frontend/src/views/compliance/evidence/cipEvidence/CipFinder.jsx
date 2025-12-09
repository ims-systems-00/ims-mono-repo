import React, { useState } from "react";
import { useGetCips } from "../../hooks/useGetCips";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
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
import { useLinkCipEvidence } from "../../hooks/useLinkCipEvidence";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { draftJSToText } from "@/utils/draftJsToText";

export const CipFinder = ({ clause }) => {
  const { cips, queryHandlers, pagination } = useGetCips();
  const { isOpen, toggle } = useDualStateController();
  const { linkCipEvidence, isPending } = useLinkCipEvidence();
  const [selected, setSelected] = useState("");

  console.log(clause);

  return (
    <div className="pt-3">
      <SearchInput queryHandlers={queryHandlers} />

      {cips?.length === 0 ? (
        <div className="text-center text-gray-500 italic mt-3">
          No CIPs found.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cips?.map((cip) => {
            const status = cip?.implemented?.status
              ? "Implemented"
              : "Not Implemented";

            return (
              <div key={cip?._id} className="border rounded-3 p-3 mt-3">
                <div>
                  <div className="d-flex align-items-start justify-content-between">
                    <h5 className="mb-2">
                      {cip?.reference} — {cip?.title}
                    </h5>
                    <div className="ml-auto">
                      <TooltipButton
                        style={{ cursor: "pointer" }}
                        tooltip="Link Cip"
                        onClick={(e) => {
                          setSelected(cip?._id);
                          toggle();
                        }}
                        name="delete"
                        size="sm"
                        id="delete"
                        color="link"
                        className="btn-link-primary border border-0"
                      >
                        <i className="ims-icons-20 icon-icon-plus-24" />
                      </TooltipButton>
                    </div>
                  </div>
                  <BadgeStatus status={status} />
                  <p className="mt-2">
                    <span className="text-black font-medium">
                      Opportunity For Improvement:
                    </span>{" "}
                    <span>{draftJSToText(cip?.opportunityForImprovement)}</span>
                  </p>
                </div>

                <div className="d-flex justify-content-between mt-2 flex-wrap">
                  <p>
                    <span className="text-black fw-medium">Business Unit:</span>{" "}
                    <span>{cip?.group?.name || "N/A"}</span>
                  </p>

                  <p>
                    <span className="text-black fw-medium">
                      Assigned Owner:
                    </span>{" "}
                    <span>{cip?.owner?.name || "N/A"}</span>
                  </p>
                </div>
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

      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <h5 className="text-danger mt-2 mb-3">{`You are about to link this CIP to ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              This CIP will be classed as an evidence of implementation of this
              clause when auditors are auditing your organisation.
            </p>
          </Alert>

          <div className="text-center mt-2 d-flex justify-content-end gap-2 mb-2">
            <Button onClick={toggle} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                linkCipEvidence(clause?._id, {
                  evidenceType: "cip",
                  relatedCip: selected,
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
