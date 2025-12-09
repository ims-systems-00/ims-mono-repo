import React from "react";
import { useGetRisks } from "../../hooks/useGetRisks";
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
import { useLinkRiskEvidence } from "../../hooks/useLinkRiskEvidence";
import { useState } from "react";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { draftJSToText } from "@/utils/draftJsToText";

export const RiskFinder = ({ clause }) => {
  const { risks, queryHandlers, pagination } = useGetRisks();
  const { isOpen, toggle } = useDualStateController();
  const { linkRiskEvidence, isPending } = useLinkRiskEvidence();
  const [selected, setSelected] = useState("");

  return (
    <div className="pt-3">
      <>
        <SearchInput queryHandlers={queryHandlers} />
        {risks?.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No risks found.
          </div>
        ) : (
          <div className="flex flex-col  gap-4">
            {risks?.map((risk) => {
              const score = risk?.score?.total?.current || 0;

              const status = risk?.mitigated?.status
                ? "Mitigated"
                : risk?.accepted?.status
                ? "Accepted"
                : risk?.escalated?.status
                ? "Escalated"
                : "Open";

              return (
                <>
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    key={risk?._id}
                    className="border rounded-3 p-3 mt-3"
                  >
                    <div>
                      <div className="d-flex align-items-start justify-content-between">
                        <h5 className="mb-2">
                          {risk?.reference} — {risk?.title}
                        </h5>
                        <div className="ml-auto">
                          <TooltipButton
                            tooltip="Link Risk"
                            onClick={(e) => {
                              setSelected(risk?._id);
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
                          Description:
                        </span>{" "}
                        <span>{draftJSToText(risk?.description)}</span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-2 flex-wrap">
                      <p>
                        <span className="text-black font-medium">
                          Business Unit:
                        </span>{" "}
                        <span>{risk?.group?.name || "N/A"}</span>
                      </p>

                      <p>
                        <span className="text-black font-medium">
                          Risk Score:
                        </span>{" "}
                        <span className="font-semibold">{score}</span>
                      </p>

                      <p>
                        <span className="text-black font-medium">Owner:</span>{" "}
                        <span>{risk?.owner?.name || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                </>
              );
            })}

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={pagination?.totalResults}
              currentPage={
                pagination?.currentPage ? pagination?.currentPage : 1
              }
              onPageChange={(page) => queryHandlers.handlePagination(page)}
              size={pagination?.size}
            />
          </div>
        )}
      </>

      <Modal isOpen={isOpen} toggle={() => toggle()} centered>
        <ModalHeader toggle={() => toggle()}></ModalHeader>
        <ModalBody>
          <h5 className="text-danger mt-2 mb-3">{`You are about to link this risk to ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              This risk will be classed as an evidence of implementation of this
              clause when auditors are auditing your organisation.
            </p>
          </Alert>

          <div className="text-center mt-2 d-flex justify-content-end gap-2">
            <Button onClick={() => toggle()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                linkRiskEvidence(clause?._id, {
                  evidenceType: "risk-management",
                  relatedRisk: selected,
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
