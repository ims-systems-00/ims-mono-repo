/**
 * CAUTION: This component is restricted to be coupled wih
 * useSearchableComplaice store. This is meant to be utilised
 * as an independent component only to show case data.
 */
import React from "react";
import { Card, CardBody, Badge, Progress } from "@ims-systems-00/ims-ui-kit";
import SafeHtml from "@/components/HtmlParser/SafeHtml";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";
import Box from "@/components/Box/Index";

const ComplianceStripe = ({
  compliance,
  isActive,
  isDisabled,
  onClick = () => {},
  actions,
  warningWithConfirmMessage = () => {},
  varient = "",
}) => {
  const history = useHistory();
  return (
    <React.Fragment>
      {compliance && (
        <Box
          noShadow
          varient={isActive ? "primary-light" : ""}
          className={classNames({
            "bg-none": isDisabled,
          })}
          onClick={() => {
            if (!isDisabled) onClick(compliance);
          }}
        >
          <div className="d-flex justify-content-between">
            <div>
              <Link
                onClick={(e) => {
                  e.stopPropagation();
                  warningWithConfirmMessage(
                    "You are about to leave this page. Any unsaved changes will be lost. Are you sure you want to continue?",
                    () => {
                      history.push(`/admin/controls/${compliance?._id}`);
                    }
                  );
                }}
              >
                <span className="font-size-body-1 text-dark">
                  {compliance?.control?.clause +
                    " " +
                    compliance?.control?.title}{" "}
                </span>
                <span className="font-size-overline text-secondary">
                  {" "}
                  {compliance.name}
                </span>
              </Link>
            </div>
            <div>
              {actions && (
                <div
                  className="inline-block pull-right"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {React.Children.map(actions, (child) =>
                    React.cloneElement(child, { compliance })
                  )}
                </div>
              )}
            </div>
          </div>

          <p>
            <span>
              Selection{" "}
              {compliance.selected === "Selected" ? (
                <i className="ims-icons-20 icon-icon-checkcircle-24 text-success" />
              ) : (
                <i className="ims-icons-20 icon-icon-xcircle-24 text-danger" />
              )}
            </span>{" "}
            <span>
              Status{" "}
              {compliance.state === "Implemented" ? (
                <i className="ims-icons-20 icon-icon-checkcircle-24 text-success" />
              ) : (
                <i className="ims-icons-20 icon-icon-xcircle-24 text-danger" />
              )}
            </span>{" "}
            &nbsp;
            <Badge color="primary">{compliance.compliancePercentage}%</Badge>
          </p>

          <SafeHtml html={compliance?.control?.description || ""} />
        </Box>
      )}
    </React.Fragment>
  );
};

export default ComplianceStripe;
