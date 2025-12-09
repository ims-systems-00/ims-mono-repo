import Box from "@/components/Box/Index";
import ReactTable from "@/components/ReactTable/ReactTable";
import useModal from "@/hooks/useModal";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { getColoredPercentage } from "@/utils/getColoredPercentage";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import ClauseDetail from "./ClauseDetail";
import RowExpanded from "./RowExpanded";
const defaultdata = [];

const ComplianceToolTable = ({
  toolkit,
  dataTable,
  processing,
  updateDataTable,
  dispatch,
  ...rest
}) => {
  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });

  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data._id,
          clause: data.control.clause,
          title: data.control.title,
          selected: data.selected,
          requirementMet: data.state,
          compliance: data.compliancePercentage,
          description: data.control.description,
          updatedOn:
            data.updated && data.updated.on ? (
              <TimeDateComponent date={data.updated?.on} />
            ) : (
              ""
            ),
          updatedBy: data.updated && data.updated.by && data.updated.by.name,
          activateView: activateView,
          data: data,
          actions: (
            <UncontrolledDropdown size="sm" direction="right">
              <DropdownToggle
                outline
                onClick={(e) => {
                  e.stopPropagation();
                }}
                data-display="static"
                className="border border rounded-circle"
              >
                <i className="fa-solid fa-ellipsis-h" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={(e) => {
                    activateView(data);
                    e.stopPropagation();
                  }}
                  id="detail"
                  tooltip="View Details"
                >
                  Details
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ),
        };
      }),
    [dataTable, processing]
  );
  const renderRowSubComponent = React.useCallback(
    ({ row }) => <RowExpanded data={row.original} />,
    []
  );
  return (
    <React.Fragment>
      {processing.action === "load-compliance" && (
        <span className="text-success text-center font-size-subtitle-1">
          Loading {toolkit}
        </span>
      )}
      <ReactTable
        data={data}
        renderRowSubComponent={renderRowSubComponent}
        columns={[
          {
            Header: "Clause",
            accessor: "clause",
            style: {
              width: "6%",
            },
          },
          {
            Header: "Title",
            accessor: "title",
            style: {
              width: "40%",
            },
          },
          {
            Header: "Selected",
            accessor: "selected",
            Cell: (item) =>
              item.value === "Selected" ? (
                <span className="text-success">{item.value}</span>
              ) : (
                <span className="text-danger">{item.value}</span>
              ),
            style: {
              width: "10%",
            },
          },
          {
            Header: "Status",
            accessor: "requirementMet",
            Cell: (item) => <BadgeStatus status={item.value} />,
            style: {
              width: "10%",
            },
          },
          {
            Header: "Compliance",
            accessor: "compliance",
            Cell: (item) => (
              <span className={getColoredPercentage(item.value)}>
                {item.value}
              </span>
            ),
            style: {
              width: "10%",
            },
          },
          {
            Header: "Last updated",
            accessor: "updatedOn",
            style: {
              width: "10%",
            },
          },
          {
            Header: "Updated by",
            accessor: "updatedBy",
            style: {
              width: "10%",
            },
          },
          {
            Header: "Actions",
            accessor: "actions",
            style: {
              width: "5%",
            },
          },
        ]}
        className="-striped -highlight"
        isFilterable
        isSearchable
        title={toolkit}
        rowProps={function (row) {
          return {
            onClick: function (e) {
              activateView(row.original.data);
            },
          };
        }}
        {...rest}
      />

      <Modal title="Control">
        <ClauseDetail isModalOpen={isOpen} />
      </Modal>
    </React.Fragment>
  );
};

export default ComplianceToolTable;
