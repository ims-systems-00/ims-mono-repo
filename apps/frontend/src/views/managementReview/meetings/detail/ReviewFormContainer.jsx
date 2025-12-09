import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import ManagmentReviewForm from "../ReviewForm";
import { useSchedule } from "../store";

const ReviewFormContainer = () => {
  const { visitingReview, updateReview, completeReview } = useSchedule();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <ManagmentReviewForm
        visitingReview={visitingReview}
        onSubmit={async (data) => {
          await updateReview(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onComplete={async () => {
          await completeReview();
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default ReviewFormContainer;
