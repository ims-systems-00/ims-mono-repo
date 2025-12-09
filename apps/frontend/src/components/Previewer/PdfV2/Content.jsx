/**
 * this component handles only the api logic and passes the previewable
 * pdf down to the childs for processing and layouting.
 */
import Loading from "@/components/Loader/IMSLoading";
import React from "react";
import { Button } from "@ims-systems-00/ims-ui-kit";
import Layout from "./Layout";
import { USER_ACTIONS } from "./store/actions";
import useViewer from "./store/useViewer";
const LoadingPdf = () => {
  return (
    <div className="mt-5">
      <Loading />
      <h4 className="m-3">Preparing your document</h4>
    </div>
  );
};
const Content = ({ fileDetails, ...props }) => {
  const { processing, previewUrl } = useViewer();
  return (
    <>
      {processing[USER_ACTIONS.API_LOAD].status ? (
        <center>
          <LoadingPdf />
          <Button
            size="sm"
            className="btn "
            color="danger"
            onClick={props?.toolBarProps?.onPreviewClose}
          >
            Close popup
          </Button>
        </center>
      ) : (
        previewUrl && <Layout />
      )}
    </>
  );
};

export default Content;
