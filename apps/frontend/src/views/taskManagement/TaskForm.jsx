import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputCheck,
  ImsInputDropZone,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
// contexts ...
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useUsers from "@/hooks/useUsers";
import { useContext } from "react";
import { mapToTaskModel } from "@/services/tasksServices";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";

let priorities = ["High", "Medium", "Low"];

/** guard check is a must inevery object chaining in this file */

const TaskForm = ({
  task,
  defaultPopulation,
  drawerView,
  module,
  moduleType,
  onSubmit = () => {},
  onCompleteTask = () => {},
}) => {
  let { groups } = React.useContext(SuperGlobalContext);
  let { authGlobalAccess, entityAccessControl } = useAccess();
  let viewContextData = useContext(ViewContext);
  let { users, lazyLoadUsers } = useUsers();
  let dataSet = task
    ? mapToTaskModel(task)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          name: defaultPopulation?.name || "",
          description: defaultPopulation?.description || "",
          due: "",
          assignedTo: [],
          attachments: [],
          teamPriority: false,
          module: module,
          moduleType: moduleType,
          priority: {
            value: "Medium",
            label: "Medium",
          },
        },
        errors: {},
      };
  // Validation rules ....
  const schema = {
    teamPriority: IVal.boolean().label("Team priority"),
    group: IVal.when("teamPriority", {
      is: true,
      then: IVal.object().keys({
        value: IVal.string().required().label("Business unit"),
        label: IVal.label("Business unit"),
      }),
    }),
    priority: IVal.when("teamPriority", {
      is: true,
      then: IVal.object().keys({
        value: IVal.string().required().label("Priority"),
        label: IVal.label("Priority"),
      }),
    }),
    name: IVal.string().required().label("Task"),
    description: IVal.string().required().label("Description"),
    due: IVal.string().required().label("Due date"),
    assignedTo: IVal.array(),
    attachments: IVal.label("Attachments"),
    moduleType: IVal.label("ModuleType"),
    module: IVal.label("ModuleType"),
  };
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    confirmation,
    handleFileChange,
    isBusy,
  } = useForm(dataSet, schema);
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  let { data, errors } = dataModel;
  return (
    <>
      {confirmation}
      <Form action="/" className="form-horizontal" method="get">
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Task"
              name="name"
              mandatory={true}
              value={data.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Name a task"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label={"Priority"}
              name="priority"
              mandatory={true}
              value={data.priority}
              isDisabled={
                task &&
                entityAccessControl({
                  users: task?.created?.by ? [task.created?.by?._id] : [],
                  effect: "Block",
                })
              }
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={priorities.map((priority) => ({
                value: priority,
                label: priority,
              }))}
            />
          </Col>
        </Row>

        <ImsTextEditor
          label="Description"
          name="description"
          mandatory={true}
          placeholder={"Add a description."}
          mediaLinkGeneratorFn={linkGenerator}
          onEachFileSelection={handleUpload}
          value={task?.description || defaultPopulation?.description}
          onChange={handleChange}
          error={errors.description}
        />

        {task ? (
          entityAccessControl({
            users: task?.created?.by ? [task?.created?.by?._id] : [],
            effect: "Allow",
          }) && (
            <>
              <ImsInputCheck
                checked={data.teamPriority}
                label="Team task"
                name="teamPriority"
                value={data.teamPriority}
                onChange={handleChange}
                error={errors.teamPriority}
              />
            </>
          )
        ) : (
          <>
            <ImsInputCheck
              checked={data.teamPriority}
              label="Team task"
              name="teamPriority"
              value={data.teamPriority}
              onChange={handleChange}
              error={errors.teamPriority}
            />
          </>
        )}
        {dataModel.data.teamPriority && (
          <>
            <ImsInputSelect
              label={authGlobalAccess() ? "Business unit" : "Business unit"}
              name="group"
              value={data.group}
              mandatory={true}
              className="react-select default"
              classNamePrefix="react-select"
              isDisabled={
                task &&
                entityAccessControl({
                  users: task?.created?.by ? [task?.created?.by?._id] : [],
                  effect: "Block",
                })
              }
              onChange={handleChange}
              options={groups.map((group) => ({
                value: group._id,
                label: group.name,
              }))}
            />
          </>
        )}

        <Row>
          {!dataModel.data.teamPriority && (
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputSelect
                isMulti
                label="Assign to"
                name="assignedTo"
                isDisabled={
                  task &&
                  entityAccessControl({
                    users: task?.created?.by ? [task?.created?.by?._id] : [],
                    effect: "Block",
                  })
                }
                icon="icon-app"
                value={data.assignedTo}
                className="react-select default"
                classNamePrefix="react-select"
                error={errors.assignedTo}
                onChange={handleChange}
                options={users.map((user) => ({
                  value: user._id,
                  label: user.name,
                }))}
              />
            </Col>
          )}

          <Col md={drawerView ? "12" : "6"}>
            <ImsInputDate
              label="Due date"
              mandatory={true}
              name="due"
              disabled={
                task &&
                entityAccessControl({
                  users: task?.created?.by ? [task?.created?.by?._id] : [],
                  effect: "Block",
                })
              }
              value={data.due}
              onChange={handleChange}
              error={errors.due}
            />
          </Col>
        </Row>

        <ImsInputDropZone
          label="Attachments"
          clearAll={!data.attachments.length}
          name="tasks"
          onLoad={(files) => handleFileChange(files, "attachments")}
        />
        <ImsButtonGroup>
          {task && task?._id ? (
            <>
              {!drawerView && (
                <Button
                  name="cancel"
                  className="btn-fill"
                  color="danger"
                  type="button"
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={(e) =>
                  handleSubmit(e, () => onSubmit(dataModel.data), false)
                }
                disabled={validate() ? true : isBusy}
                className="btn-fill"
                color="info"
                type="button"
              >
                {isBusy ? "Updating..." : "Update"}
              </Button>
              {entityAccessControl({
                users: task?.created?.by
                  ? [
                      task?.created?.by?._id,
                      ...task?.assignedTo?.map(
                        (assignee) => assignee?.user?._id
                      ),
                    ]
                  : [],
                effect: "Allow",
              }) && (
                <Button
                  onClick={(e) => {
                    handleSubmit(e, () => onCompleteTask(), false, {
                      confirmation: true,
                      confirmationMessage:
                        "This task will be completed. No one else will be able to amend it later",
                    });
                  }}
                  disabled={validate() ? true : isBusy}
                  className="btn-fill"
                  color="primary"
                  type="button"
                >
                  {isBusy ? "Completing..." : "Complete"}
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
              disabled={validate() ? true : isBusy}
              className="btn-fill"
              color="primary"
              type="button"
            >
              {isBusy ? "Creating..." : "Create"}
            </Button>
          )}
        </ImsButtonGroup>
      </Form>
    </>
  );
};
export default TaskForm;
