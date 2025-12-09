import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Form, TextEditor } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { mapToActivityModel } from "@/services/activityService";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import useActivity from "./store/useActivity";
const ActivityBox = ({ activity }) => {
  const { selectActivity, createActivity, updateActivity } = useActivity();
  const dataSet = activity
    ? mapToActivityModel(activity)
    : {
        data: {
          value: "",
          assignedTo: {
            value: null,
            label: "Select user",
          },
        },
        errors: {},
      };
  const schema = {
    value: IVal.string().required().label("Activity"),
    assignedTo: activity?.assigned?.to
      ? IVal.object().keys({
          value: IVal.label("Owner"),
          label: IVal.label("Owner"),
        })
      : IVal.object().keys({
          value: IVal.label("Owner"),
          label: IVal.label("Owner"),
        }),
  };
  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  let { users, lazyLoadUsers } = useUsers();

  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);
  return (
    <Form action="/" className="form-horizontal mt-3" method="get">
      <TextEditor
        name="value"
        value={data.value}
        onDataStructureChange={(value) => {
          handleChange({
            currentTarget: {
              name: "value",
              value: value,
            },
          });
        }}
        error={errors.value}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        mentionSuggestions={users}
      />
      <div className="mt-2">
        {activity && activity._id ? (
          <React.Fragment>
            <Button
              size="sm"
              color="primary"
              className="border border-0"
              outline
              type="button"
              disabled={validate() ? true : isBusy}
              onClick={(e) => {
                handleSubmit(e, () => updateActivity(data), false);
                selectActivity(null);
              }}
            >
              {isBusy ? "Saving..." : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => selectActivity(null)}
            >
              Cancel
            </Button>
          </React.Fragment>
        ) : (
          <Button
            size="sm"
            className="border mt-2"
            outline
            color="primary"
            disabled={validate() ? true : isBusy}
            onClick={(e) => {
              handleSubmit(e, () => createActivity(data));
            }}
          >
            {isBusy ? "Saving..." : "Add comment"}
          </Button>
        )}
      </div>
    </Form>
  );
};

export default ActivityBox;
