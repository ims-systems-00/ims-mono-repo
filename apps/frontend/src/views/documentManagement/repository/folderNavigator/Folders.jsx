import useDualStateController from "@/hooks/useDualStateController";
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { Link } from "react-router-dom";
import useRepository from "../store/useRepository";
import USER_ACTIONS from "../store/actions";
import Loading from "@/components/Loader/Loading";

const Folder = ({ selectionNode, node }) => {
  let { moveNode, visitNode, processing } = useRepository();
  const { isOpen: isNavactionsOpen, toggle: toggleNavaAtions } =
    useDualStateController();
  return (
    <ListGroupItem onClick={toggleNavaAtions}>
      <Row>
        <Col md="11">
          <Link to="#" onClick={() => visitNode(node._id)}>
            <i className="fa-solid fa-folder" /> {node.name}
          </Link>
        </Col>
        <Col md="1">
          {isNavactionsOpen && (
            <Dropdown isOpen={isNavactionsOpen} toggle={toggleNavaAtions}>
              <DropdownToggle className="btn btn-light  btn-block ml-auto">
                <i className="fa-solid fa-angle-down" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  onClick={() => moveNode(selectionNode?._id, node?._id)}
                >
                  <i className="fa-solid fa-paste" /> Move here
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </Col>
      </Row>
    </ListGroupItem>
  );
};

const Folders = ({ selectionNode }) => {
  let { getVisitingNodeFolders, processing } = useRepository();
  let list = getVisitingNodeFolders()
    .filter((node) => node?._id !== selectionNode?._id)
    .map((node) => {
      return (
        <Folder key={node?._id} node={node} selectionNode={selectionNode} />
      );
    });
  return (
    <ListGroup className="mb-2">
      {processing[USER_ACTIONS.LOAD_CHILD_NODES].status ? (
        <Loading text="Loading folders" />
      ) : list.length ? (
        list
      ) : (
        <ListGroupItem className="text-secondary text-center">
          This place is empty
        </ListGroupItem>
      )}
    </ListGroup>
  );
};

export default Folders;
