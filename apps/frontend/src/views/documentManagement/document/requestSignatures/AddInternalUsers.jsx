import classNames from "classnames";
import { Button, Col, Container, Row, Table } from "@ims-systems-00/ims-ui-kit";
import useDocument from "../store/useDocument";
import useRequestSignature from "./store/useRequestSignature";
const AddInternalUsers = () => {
  const { getAvailableUsersForRequest } = useDocument();
  const {
    selectedInternalUserIds,
    toggleAllInternalUsersInTheList,
    toggleInternalUserIdInTheList,
  } = useRequestSignature();
  return (
    <Container>
      <span className="">Select users for signature</span>
      <hr></hr>
      <Table className="">
        <tbody>
          <tr>
            <td className="text-bold p-0">Select all</td>
            <td className="text-right p-0">
              <Button
                className="btn-icon pull-right"
                onClick={() =>
                  toggleAllInternalUsersInTheList(
                    getAvailableUsersForRequest()?.map((user) => user?._id)
                  )
                }
              >
                {selectedInternalUserIds.length ===
                getAvailableUsersForRequest().length ? (
                  <i className="fa-solid fa-circle-check" />
                ) : (
                  <i className="fa-regular fa-circle" />
                )}
              </Button>
            </td>
          </tr>
          {getAvailableUsersForRequest()?.map((user) => (
            <tr key={user?._id}>
              <td className="p-0">{user.name}</td>
              <td className="text-right p-0">
                <Button
                  className="btn-icon pull-right"
                  onClick={() => toggleInternalUserIdInTheList(user?._id)}
                >
                  {selectedInternalUserIds.includes(user?._id) ? (
                    <i className="fa-solid fa-circle-check" />
                  ) : (
                    <i className="fa-regular fa-circle" />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AddInternalUsers;
