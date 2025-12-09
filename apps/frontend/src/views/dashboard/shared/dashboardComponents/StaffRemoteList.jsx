import React from "react";
import {
  Button,
  UncontrolledPopover,
  PopoverBody,
} from "@ims-systems-00/ims-ui-kit";
import { Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import useModal from "@/hooks/useModal";
import Index from "@/views/ourIms/users/detail/Index";

const StaffRemoteList = ({ staffRemote = [] }) => {
  let history = useHistory();
  let { activateView, Modal } = useModal();
  return (
    staffRemote.length > 0 && (
      <React.Fragment>
        <Button
          id="staff-remote-list"
          outline
          className="border-0 bg-transparent shadow-none members-list d-flex p-0 m-0 "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {staffRemote.slice(0, 4).map((member, index) => {
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
            {staffRemote.length > 4 && (
              <span className="text-secondary font-weight-bold">
                {staffRemote.length - 4}+
              </span>
            )}
          </span>
        </Button>
        <UncontrolledPopover
          placement="bottom"
          trigger="hover"
          target="staff-remote-list"
        >
          <PopoverBody
            style={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
            className="shadow rounded p-0 border"
          >
            <Row></Row>
            {staffRemote.map((member, index) => {
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

export default StaffRemoteList;
