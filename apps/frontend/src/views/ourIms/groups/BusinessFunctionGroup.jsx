import { ImsInputText } from "@ims-systems-00/ims-ui-kit";

const BusinessFunctionGroup = ({ dataModel, handleChange }) => {
  let { data, errors } = dataModel;
  return (
    <>
      <ImsInputText
        label="Name"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Name"
      />
      <ImsInputText
        label="Operating location"
        name="operatingLocation"
        value={data.operatingLocation}
        onChange={handleChange}
        error={errors.operatingLocation}
        placeholder="Operating location"
      />
    </>
  );
};

export default BusinessFunctionGroup;
