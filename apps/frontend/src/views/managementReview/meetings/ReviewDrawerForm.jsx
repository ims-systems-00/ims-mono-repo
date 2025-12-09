import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import ManagmentReviewForm from "./ReviewForm";
import { useSchedule } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const ReviewDrawerForm = () => {
  const { visitingReview, updateReview, completeReview } = useSchedule();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingReview} />
      <ManagmentReviewForm
        visitingReview={visitingReview}
        drawerView
        onSubmit={async (data) => {
          await updateReview(data);
          closeDrawer("edit-review-form");
        }}
        onComplete={async () => {
          await completeReview();
          closeDrawer("edit-review-form");
        }}
      />
    </React.Fragment>
  );
};

export default ReviewDrawerForm;
