import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { createActivity } from "@/services/activityService";
import { getCurrentSessionData } from "@/services/authService";
import { handleAuthorisation } from "@/services/documentManagement/index";
import IVal from "@/validations/validator";
import { ImsInputCheck } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";

const DocAuthorize = ({ repoId, node, ...props }) => {
  let authoriser = node?.documentData?.authorisation?.find(
    (auth) => auth?.user?._id === getCurrentSessionData()?.user?._id
  );
  const [processing, setProcessing] = useState({
    action: null,
    id: null,
    hasMore: true,
  });
  const dataSet = {
    data: {
      id: "",
      value: "",
      assignedTo: {
        value: null,
        label: "Select user",
      },
    },
    errors: {},
  };
  const schema = {
    id: IVal.label("feedback"),
    value: IVal.string().required().label("Feedback"),
    assignedTo: IVal.object().keys({
      value: IVal.label("Owner"),
      label: IVal.label("Owner"),
    }),
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;

  let history = useHistory();

  const [shouldPublish, setShouldPublish] = React.useState(true);
  const notify = useContext(NotificationContext);
  let { entityAccessControl } = useAccess();

  const handleAuthorise = async (status) => {
    try {
      //auth_status = "Rejected"
      //auth_status = "Approved"
      setProcessing((prevProcessing) => ({
        ...prevProcessing,
        action: "authorise",
      }));
      const { data } = await handleAuthorisation(
        repoId,
        node?._id,
        authoriser?._id,
        {
          status: status,
        }
      );
      notify(`Document ${status} successfully`, "success");
      setProcessing((prevProcessing) => ({
        ...prevProcessing,
        action: null,
      }));
      history.push(`/admin/document-repositories/${repoId}`);
    } catch (ex) {
      notify("Error Authorising Document", "danger");
      setProcessing((prevProcessing) => ({
        ...prevProcessing,
        action: null,
      }));
    }
  };

  async function handleReject(e, dataModel) {
    try {
      setProcessing((prevProcessing) => ({
        ...prevProcessing,
        action: "add-activity",
      }));
      await createActivity({
        moduleId: node._id,
        moduleType: "documenttrees",
        group: null,
        ...dataModel.data,
      });
      notify("Comment added successfully ", "success");
      setProcessing((prevProcessing) => ({
        ...prevProcessing,
        action: null,
      }));
    } catch (error) {
      notify("Error adding comment", "error");
      setProcessing((prevProcessing) => ({
        ...prevProcessing,
        action: null,
      }));
    }
  }
  return (
    <>
      {authoriser?.status === "Pending" &&
        entityAccessControl({
          users:
            node?.documentData?.authorisation?.map((auth) => auth.user._id) ||
            [],
          effect: "Allow",
        }) && (
          <div>
            <ImsInputCheck
              onChange={(e) => {
                setShouldPublish(e.target.checked);
              }}
              checked={shouldPublish}
              isHorizontal={true}
              label="I authorise the document to be Published"
            />
            {!shouldPublish && (
              <>
                <ImsInputText
                  label="Feedback"
                  placeholder="Rejected for...."
                  type="textarea"
                  rows="6"
                  name="value"
                  value={data?.value || ""}
                  onChange={handleChange}
                  // error={errors.description}
                />
              </>
            )}
            <div className="ims-faded-button">
              <Button
                onClick={(e) => {
                  handleSubmit(e, handleReject);
                  handleAuthorise("Rejected");
                }}
                disabled={shouldPublish || !data?.value || processing?.action}
              >
                Reject
              </Button>
              <Button
                disabled={!shouldPublish || processing?.action === "authorise"}
                onClick={(e) => {
                  handleAuthorise("Approved");
                }}
              >
                {processing?.action === "authorise"
                  ? "Authorising..."
                  : "Authorise"}
              </Button>
            </div>
          </div>
        )}
    </>
  );
};

export default DocAuthorize;
