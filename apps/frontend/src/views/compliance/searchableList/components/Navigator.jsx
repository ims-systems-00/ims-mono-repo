import React from "react";
import {
  Input,
  Select,
  FormGroup,
  Button,
  Row,
  Col,
} from "@ims-systems-00/ims-ui-kit";
import useDebounce from "@/hooks/useDebounce";
import { USER_ACTIONS, useSearchableCompliance } from "../store";
import Loading from "@/components/Loader/Loading";
import { IMS_SERVICES } from "@/rolesAndPermissions";
const filters = [
  IMS_SERVICES.ISO20000,
  IMS_SERVICES.ISO27001,
  IMS_SERVICES.ISO27001_2022,
  IMS_SERVICES.ISO27001_2022_ANNEX_A,
  IMS_SERVICES.ISO27002,
  IMS_SERVICES.ISO9001,
  IMS_SERVICES.ISO45001,
  IMS_SERVICES.ISO14001,
  IMS_SERVICES.ISO15686_5,
  IMS_SERVICES.DSPTNHS,
  IMS_SERVICES.BS9997,
];
const Navigator = ({}) => {
  const [searchString, setSearchString] = React.useState("");
  const {
    searchControls,
    applyToolFilters,
    avialableToolokits,
    visitNextPage,
    visitPrevPage,
    processing,
    numberOfSelectedControls,
  } = useSearchableCompliance();
  const debouncedSearchString = useDebounce(searchString, 500);
  React.useEffect(() => {
    searchControls(searchString);
  }, [debouncedSearchString]);
  return (
    <div className="mb-2">
      <Row className="mt-2">
        <Col md="9">
          <FormGroup>
            <Select
              placeholder="Select standard"
              isMulti
              options={filters
                .filter((tool) => avialableToolokits.includes(tool))
                .map((t) => ({ label: t, value: t }))}
              onChange={(s) => applyToolFilters(s.map((i) => i.value))}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <Button className="pull-right" outline onClick={visitNextPage}>
            <i className="fa-solid fa-right-long"></i>
          </Button>
          <Button className="pull-right" outline onClick={visitPrevPage}>
            <i className="fa-solid fa-left-long"></i>
          </Button>
        </Col>
        <Col md="12">
          <FormGroup>
            <Input
              placeholder="Search for clauses, controls or sub-controls"
              onChange={(e) =>
                setSearchString(e.currentTarget.value.toString())
              }
            />
          </FormGroup>
        </Col>
        {numberOfSelectedControls > 0 && (
          <Col md="12">
            <p className="text-center text-primary">
              You have selected {numberOfSelectedControls} controls
            </p>
          </Col>
        )}
      </Row>

      {processing[USER_ACTIONS.SEARCH_CONTROLS].status && <Loading />}
    </div>
  );
};

export default Navigator;
