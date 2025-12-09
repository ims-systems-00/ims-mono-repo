import useModal from "@/hooks/useModal";
import {
  Button,
  PopoverBody,
  UncontrolledPopover,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import Index from "@/views/ourIms/users/detail/Index";

const StaffList = ({ staff = [] }) => {
  let history = useHistory();
  let { activateView, Modal } = useModal();
  return (
    staff.length > 0 && (
      <React.Fragment>
        <Button
          id="staff-list"
          outline
          className="border-0 bg-transparent shadow-none members-list d-flex p-0 m-0 "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {staff.slice(0, 4).map((member, index) => {
            return (
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                className="rounded-circle member border"
                key={index}
                src={member?.profileImageSrc}
                alt={member.name}
              />
            );
          })}
          <span
            style={{
              width: "30px",
              height: "30px",
            }}
            className="rounded-circle member border d-inline-block d-flex justify-content-center align-items-center bg-light"
          >
            {staff.length > 4 && (
              <span className="text-secondary font-weight-bold">
                {staff.length - 4}+
              </span>
            )}
          </span>
        </Button>
        <UncontrolledPopover
          placement="bottom"
          trigger="hover"
          target="staff-list"
        >
          <PopoverBody
            style={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
            className="shadow rounded p-0 border"
          >
            {staff.map((member, index) => {
              return (
                <div
                  className="my-2 task-card px-2 py-1 d-flex align-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    activateView(member);
                  }}
                >
                  <img
                    style={{
                      width: "36px",
                      height: "36px",
                      marginRight: "12px",
                    }}
                    src={
                      member?.profileImageSrc ||
                      "https://assets.imssystems.tech/images/system/avatar-placeholder.jpg"
                    }
                    alt="avatar"
                    className="  border mt-1"
                  />
                  <div>
                    <p>{member.name}</p>
                    <strong>
                      <small
                        style={{
                          wordBreak: "break-all",
                        }}
                      >
                        {member?.jobTitle}
                      </small>
                    </strong>
                  </div>
                </div>
              );
            })}
          </PopoverBody>
        </UncontrolledPopover>
        <Modal title="Profile">
          <Index />
        </Modal>
      </React.Fragment>
    )
  );
};

export default StaffList;
