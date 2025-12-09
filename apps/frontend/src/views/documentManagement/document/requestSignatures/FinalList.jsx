import React from "react";
import { Row, Col, Card, CardBody, Button } from "@ims-systems-00/ims-ui-kit";
import { useDocument } from "../store";
import { useRequestSignature } from "./store";
const FinalList = ({}) => {
  const { getAvailableUsersForRequest } = useDocument();
  const {
    selectedInternalUserIds,
    selectedExternalEmails,
    toggleInternalUserIdInTheList,
    removeFromSelectedExternalEmailsList,
  } = useRequestSignature();
  return (
    <React.Fragment>
      {selectedInternalUserIds.length ? (
        <React.Fragment>
          <span>Audience: Internal</span>
          <Card>
            <CardBody>
              <Row>
                {getAvailableUsersForRequest()
                  .filter((user) => selectedInternalUserIds.includes(user?._id))
                  .map((user) => {
                    return (
                      <Col
                        key={user?._id}
                        md="3"
                        className="d-flex rounded border px-2 py-1 mb-1"
                      >
                        <div className="text-elipsis me-1">{user.name}</div>
                        <div className="ml-auto">
                          <Button
                            size="sm"
                            outline
                            color="danger"
                            className="pull-right border-0"
                            onClick={(e) =>
                              toggleInternalUserIdInTheList(user?._id)
                            }
                          >
                            <i className="fa-solid fa-trash-can" />
                          </Button>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            </CardBody>
          </Card>
        </React.Fragment>
      ) : null}

      {selectedExternalEmails.length ? (
        <React.Fragment>
          <span>Audience: External</span>
          <Card>
            <CardBody>
              <Row>
                {selectedExternalEmails.map((email) => {
                  return (
                    <Col
                      key={email}
                      className="d-flex rounded border px-2 py-1 mb-1"
                      md="6"
                    >
                      <div className="text-elipsis me-1">{email}</div>
                      <div className="ml-auto">
                        <Button
                          size="sm"
                          outline
                          color="danger"
                          className="pull-right border-0"
                          onClick={(e) =>
                            removeFromSelectedExternalEmailsList(email)
                          }
                        >
                          <i className="fa-solid fa-trash-can" />
                        </Button>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </CardBody>
          </Card>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default FinalList;
