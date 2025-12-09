import Loading from "@/components/Loader/IMSLoading";
import useProcessingControl from "@/hooks/useProcessingControl";
import React, { useEffect, useState } from "react";
import { getSignedUrl } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { USER_ACTIONS } from "./actions";
const LoadingOfficedoc = () => {
  return (
    <div className="mt-5">
      <Loading />
      <h4 className="m-3">Preparing your document</h4>
    </div>
  );
};
const Officeloader = ({
  fileDetails = {
    ETag: '"f81d1b47409d90e2f6cbbd9484d3a752"',
    VersionId: "h_a03.FoxGSiBWW53I3PxWnANoGYNDm3",
    Location:
      "https://sandbox-ims-static-resources-bucket.s3.eu-west-2.amazonaws.com/general/test02.pdf",
    key: "general/test02.pdf",
    Key: "general/test02.pdf",
    Bucket: "sandbox-ims-static-resources-bucket",
  },
}) => {
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
    <div className="pdf-wrapper">
      {previewUrl ? (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            previewUrl
          )}`}
          width={"100%"}
          height={"100%"}
          frameBorder="0"
        ></iframe>
      ) : (
        <LoadingOfficedoc />
      )}
    </div>
  );
};

export default Officeloader;
