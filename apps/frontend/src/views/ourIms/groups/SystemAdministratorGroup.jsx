import { ImsInputText } from "@/views/shared/CustomFormElements";

const SupplierPartnerGroup = ({ dataModel, handleChange }) => {
  let { data, errors } = dataModel;
  return (
    <>
      <ImsInputText
        label="Name"
        name="name"
        value={"iMS super admins"}
        disabled
      />
    </>
  );
};

export default SupplierPartnerGroup;
