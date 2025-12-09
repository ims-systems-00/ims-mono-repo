import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import AboutRepository from "./AboutRepository";
import DocumentActions from "./DocumentActions";
import ImportantAlerts from "./ImportantAlerts";
import NodesTable from "./NodesTable";
import RepositoryDescription from "./RepositoryDescription";
import RepositorySideBar from "./RepositorySideBar";
import Box from "@/components/Box/Index";
const RepositoryBody = () => {
  return (
    <>
      <div className="doc-body-container">
        <Row className="">
          <Col xl="8">
            <Box minHeight={650}>
              <ImportantAlerts />
              <DocumentActions />
              <NodesTable />
              <RepositoryDescription />
            </Box>
          </Col>
          <Col xl="4">
            <Box minHeight={650}>
              <RepositorySideBar />
              <AboutRepository />
            </Box>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RepositoryBody;
