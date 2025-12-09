import { ImsInputText } from "@ims-systems-00/ims-ui-kit";

const ComplainceBodyGroup = ({ dataModel, handleChange }) => {
  let { data, errors } = dataModel;
  return (
    <>
      <ImsInputText
        label="Compliance body"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Compliance body"
      />
      <ImsInputText
        label="Standards"
        name="standards"
        value={data.standards}
        onChange={handleChange}
        error={errors.standards}
        placeholder="Standards"
      />
    </>
  );
};

export default ComplainceBodyGroup;
