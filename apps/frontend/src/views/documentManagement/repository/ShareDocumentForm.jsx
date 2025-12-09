import React from "react";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import { useEffect } from "react";
import IVal from "@/validations/validator";
import { ImsInputText, CreatableSelect } from "@ims-systems-00/ims-ui-kit";
const ShareDocumentForm = ({ onSubmit = () => {} }) => {
  let { users, lazyLoadUsers } = useUsers();
  useEffect(() => {
    lazyLoadUsers();
  }, []);
  const dataSet = {
    data: {
      emails: [],
      message: "",
    },
    errors: {},
  };
  const schema = {
    emails: IVal.array().min(1).max(50).required().label("Email"),
    message: IVal.string().required().label("Message"),
  };
  const { dataModel, isBysy, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <React.Fragment>
      <h5 className="text-center mt-2 mb-2">Share document</h5>
      <Form>
        <CreatableSelect
          isMulti
          opttions={users.map((user) => ({
            value: user.email,
            label: user.email,
          }))}
          placeholder="Enter email"
          onChange={(selection) =>
            handleChange({
              currentTarget: {
                name: "emails",
                value: selection.map((s) => s.value),
              },
            })
          }
        />
        <ImsInputText
          label="Message"
          placeholder="Message"
          type="textarea"
          rows="6"
          name="message"
          value={data.description}
          onChange={handleChange}
          error={errors.description}
        />
        <Button
          size="sm"
          color="info"
          className="btn-block"
          disabled={validate() ? true : isBysy}
          onClick={(e) => {
            handleSubmit(e, () => onSubmit(data));
          }}
        >
          Share
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default ShareDocumentForm;
