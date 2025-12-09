import { useState } from "react";
import IVal from "@/validations/validator";
import { imsLogger } from "@/services/loggerService";
const useForm = (initdataModel, schema, doSubmit) => {
  const [dataModel, setdataModel] = useState(initdataModel);

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = IVal.validate(dataModel.data, schema, options);
    if (!error) return null;
    const errors = {};
    imsLogger("useForm", error.details);
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };
  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const objSchema = { [name]: schema[name] };
    const { error } = IVal.validate(obj, objSchema);
    return error ? error.details[0].message : null;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (errors)
      return setdataModel((prevModel) => {
        return { ...prevModel, errors: errors || {} };
      });
    // Form submission logic here ....
    doSubmit(e);
  };
  const handleChange = ({ currentTarget: input }) => {
    imsLogger("useForm", input, input.value);
    const errors = { ...dataModel.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...dataModel.data };
    input.type === "checkbox"
      ? (data[input.name] = !data[input.name])
      : (data[input.name] = input.value);
    setdataModel({ data, errors });
    imsLogger("useForm", dataModel);
  };
  const handleAddOn = ({ currentTarget: input }) => {
    imsLogger("useForm", input);
    const errors = { ...dataModel.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) return (errors[input.name] = errorMessage);
    else delete errors[input.name];
    const data = { ...dataModel.data };
    data[input.name].push(input.value.split("___")[0]);
    data[input.value.split("___")[1]] = "";
    setdataModel({ data, errors });
    imsLogger("useForm", dataModel);
  };
  const handleRemoveAddOn = ({ currentTarget: input }) => {
    const errors = { ...dataModel.errors };
    const data = { ...dataModel.data };
    data[input.name] = data[input.name].filter((data) => data !== input.value);
    setdataModel({ data, errors });
    imsLogger("useForm", dataModel);
  };

  return [
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleAddOn,
    handleRemoveAddOn,
    setdataModel,
  ];
};
export default useForm;
