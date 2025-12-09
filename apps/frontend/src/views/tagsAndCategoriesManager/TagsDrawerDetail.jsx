import React from "react";
import { USER_ACTIONS, useTagsAndCategories } from "./store";
import Loading from "@/components/Loader/Loading";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const TagsDrawerDetail = () => {
  let { processing, visitingTagAndCategory } = useTagsAndCategories();
  return (
    <div>
      {processing[USER_ACTIONS.GET_TAG_AND_CATEGORY]?.status ? (
        <Loading />
      ) : (
        visitingTagAndCategory && (
          <Row>
            <Col md="12">
              <span>
                Name:
                <span className="text-secondary">
                  {" "}
                  {visitingTagAndCategory.name}{" "}
                </span>
              </span>
            </Col>
            <Col md="12">
              <span>
                Description:
                <span className="text-secondary">
                  {" "}
                  {visitingTagAndCategory.description}{" "}
                </span>
              </span>
            </Col>

            <DetailsSectionHeader title={`Applicable modules:`} />
            <Col md="12" className="mb-4">
              {visitingTagAndCategory?.applicableModules.map(
                (applicableModule) => (
                  <p>{applicableModule}</p>
                )
              )}
            </Col>
          </Row>
        )
      )}
    </div>
  );
};

export default TagsDrawerDetail;
