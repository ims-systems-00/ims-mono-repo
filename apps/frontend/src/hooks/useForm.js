import { useState } from "react";
import IVal from "@/validations/validator";
import { imsLogger } from "@/services/loggerService";
import { asynchronously } from "@/utils/asynchronous";
import { byString } from "@/utils/objectHandlers";
Object.byString = byString;
const useForm = (initdataModel, schema) => {
  const [dataModel, setDataModel] = useState(initdataModel);
  const [isBusy, setIsBusy] = useState(false);
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
  const handleSubmit = async (
    e,
    doSubmit = () => {},
    reset = true,
    options = {}
  ) => {
    e.preventDefault();
    const errors = validate();
    if (errors) {
      return setDataModel((prevModel) => {
        return { ...prevModel, errors: errors || {} };
      });
    }

    // Form submission logic here ....
    function submission() {
      return new Promise(async (resolve, reject) => {
        let [error] = await asynchronously(doSubmit(e, dataModel));
        if (reset) resetForm();
        if (error) return reject();
        return resolve();
      });
    }
    try {
      setIsBusy(true);
      await submission();
    } catch (err) {
      imsLogger(err);
    }
    setIsBusy(false);
  };
  const handleChange = ({ currentTarget: input }) => {
    const errors = { ...dataModel.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...dataModel.data };
    input.type === "checkbox"
      ? (data[input.name] = !data[input.name])
      : (data[input.name] = input.value);
    imsLogger({ data, errors });
    setDataModel({ data, errors });
  };
  const handleFileChange = (files, name) => {
    const errors = { ...dataModel.errors };
    const data = { ...dataModel.data };
    data[name] = files;
    imsLogger("useForm", data);
    setDataModel({ data, errors });
  };
  const handleDirectionChange = ({ directions, dataMap }) => {
    let data = {};
    let errors = { ...dataModel.errors };
    dataMap.forEach((value, key) => {
      const errorMessage = validateProperty({
        name: key,
        value: Object.byString(directions, value),
      });
      if (errorMessage) errors[key] = errorMessage;
      else {
        data[key] = Object.byString(directions, value);
        delete errors[key];
      }
    });
    setDataModel({
      data: { ...dataModel.data, ...data },
      errors,
    });
  };
  const resetForm = () => {
    setDataModel(initdataModel);
  };
  const _isObject = (object) => object !== null && typeof object === "object";
  const _deepEqual = (referenceObject, testObject) => {
    const referenceKeys = Object.keys(referenceObject);
    const testKeys = Object.keys(testObject);
    if (referenceKeys.length !== testKeys.length) return false;
    for (const key of referenceKeys) {
      const referenceValue = referenceObject[key];
      const testValue = testObject[key];
      const hasProperties = _isObject(referenceValue);
      if (!hasProperties && referenceValue !== testValue) return false;
      if (hasProperties && !_deepEqual(referenceValue, testValue)) return false;
    }
    return true;
  };
  const hasUnsavedData = () => !_deepEqual(initdataModel, dataModel);
  return {
    dataModel,
    isBusy,
    handleChange,
    handleSubmit,
    validate,
    setDataModel,
    resetForm,
    handleFileChange,
    hasUnsavedData,
    handleDirectionChange,
    confirmation: <></>,
  };
};
export default useForm;
