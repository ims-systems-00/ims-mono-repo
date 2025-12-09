import Loading from "@/components/Loader/Loading";
import useDebounce from "@/hooks/useDebounce";
import { Col, FormGroup, Input, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { USER_ACTIONS, useSearchableDocument } from "../store";

const Navigator = ({}) => {
  const [searchString, setSearchString] = React.useState("");
  const { searchDocuments, processing } = useSearchableDocument();
  const debouncedSearchString = useDebounce(searchString, 500);
  React.useEffect(() => {
    searchDocuments(searchString);
  }, [debouncedSearchString]);
  return (
    <div className="mb-2 bar-sticky">
      <Row>
        <Col md="12">
          <FormGroup className="mt-3">
            <Input
              placeholder="Search for documents.."
              onChange={(e) =>
                setSearchString(e.currentTarget.value.toString())
              }
            />
          </FormGroup>
        </Col>
      </Row>
      {processing[USER_ACTIONS.SEARCH_DOCUMENTS].status && <Loading />}
    </div>
  );
};

export default Navigator;
