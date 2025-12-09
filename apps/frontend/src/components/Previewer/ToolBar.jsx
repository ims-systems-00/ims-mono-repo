import { Button, Col, Container, Input, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link } from "react-router-dom";
import { downloadFile } from "@/services/fileHandlerService";

const ToolBar = ({
  fileDetails,
  onPageChange = () => {},
  onZoomIn,
  onZoomOut,
  page,
}) => {
  const [pageEditing, setPageEditing] = React.useState(false);
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor("navbar-transparent");
    } else {
      setColor("bg-white");
    }
    setCollapseOpen(!collapseOpen);
  };
  function handlePageChange(e) {
    let value = e.currentTarget.value;
    value = parseInt(value);
    if (value && value >= 0 && value <= page?.total)
      return onPageChange({ pageNumber: value });
  }
  function toggleEdit() {
    setPageEditing((cur) => !cur);
  }
  return (
    <Container className="border-bottom py-2" fluid>
      <Row>
        <Col md={7} className="text-elipsis d-flex align-items-center">
          <Link
            className="btn-icon text-primary"
            onClick={() => downloadFile(fileDetails)}
            to="#"
          >
            {fileDetails?.Name}
          </Link>
        </Col>
        <Col md={5}>
          <div className="pull-right">
            <b className="">
              {pageEditing ? (
                <Input
                  onBlur={toggleEdit}
                  onChange={handlePageChange}
                  className="pdf-page-jump text-center me-1"
                />
              ) : (
                <Button className="text-primary btn-icon">
                  <small className="text-bold">{page?.total} Pages</small>
                </Button>
              )}
            </b>
            <Button className="border-0" onClick={onZoomIn}>
              <i className="fa-solid fa-magnifying-glass-plus" />
            </Button>
            <Button className="border-0" onClick={onZoomOut}>
              <i className="fa-solid fa-magnifying-glass-minus" />
            </Button>
            <Button
              className="border-0"
              onClick={() => downloadFile(fileDetails)}
            >
              {" "}
              <i className="fa-solid fa-download" />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default ToolBar;
