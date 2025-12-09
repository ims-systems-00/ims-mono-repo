/**
 * this component handles only the api logic and passes the previewable
 * pdf down to the childs for processing and layouting.
 */
import Loading from "@/components/Loader/IMSLoading";
import useProcessingControl from "@/hooks/useProcessingControl";
import { Button } from "@ims-systems-00/ims-ui-kit";
import { useEffect, useState } from "react";
import { getSignedUrl } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { USER_ACTIONS } from "./actions";
import ViewerContextProvider from "./Context";
import Layout from "./Layout";
const LoadingPdf = () => {
  return (
    <div className="mt-5">
      <Loading />
      <h4 className="m-3">Preparing your document</h4>
    </div>
  );
};
const Pdf = ({ fileDetails, ...props }) => {
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.API_LOAD },
  ]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const generatePreviewUrl = async () => {
    dispatch({
      [USER_ACTIONS.API_LOAD]: {
        status: true,
        error: false,
        id: null,
      },
    });
    try {
      let { data } = await getSignedUrl(fileDetails);
      setPreviewUrl(data.url);
      dispatch({
        [USER_ACTIONS.API_LOAD]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      dispatch({
        [USER_ACTIONS.API_LOAD]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };
  useEffect(() => {
    generatePreviewUrl();
  }, []);
  return (
    <>
      <ViewerContextProvider>
        {processing[USER_ACTIONS.API_LOAD].status ? (
          <center>
            <LoadingPdf />
            <Button
              className="btn "
              color="danger"
              onClick={props?.toolBarProps?.onPreviewClose}
            >
              Close popup
            </Button>
          </center>
        ) : (
          previewUrl && (
            <Layout
              fileDetails={fileDetails}
              previewUrl={previewUrl}
              {...props}
            />
          )
        )}
      </ViewerContextProvider>
    </>
  );
};

export default Pdf;
