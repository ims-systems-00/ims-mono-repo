import { ImsInputText } from "@/views/shared/CustomFormElements";

const SupplierPartnerGroup = ({ dataModel, handleChange }) => {
  let { data, errors } = dataModel;
  return (
    <>
      <ImsInputText
        label="Supplier name"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
      />
      <ImsInputText
        label="Operating location"
        name="operatingLocation"
        value={data.operatingLocation}
        onChange={handleChange}
        error={errors.operatingLocation}
      />
    </>
  );
};

export default SupplierPartnerGroup;
