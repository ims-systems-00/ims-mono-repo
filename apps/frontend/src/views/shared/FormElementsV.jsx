import FileDropZone from "@/components/CustomUpload/FileDropZone";
import TextEditor from "@/components/Editors/TextEditor";
import LocationPicker from "@/components/Pickers/LocationPicker";
import React from "react";
import ReactDatetime from "react-datetime";
import Select from "react-select";
import {
  Label,
  Input,
  FormGroup,
  Row,
  Col,
  InputGroup,
  Button,
  InputGroupText,
  Progress,
} from "@ims-systems-00/ims-ui-kit";
import { imsLogger } from "@/services/loggerService";
import DocUpload from "../../components/CustomUpload/DocUpload";
import ImageUpload from "../../components/CustomUpload/ImageUpload";

export function ImsInputText({
  label,
  type = "text",
  error,
  onChange,
  ...rest
}) {
  return (
    <>
      <FormGroup>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          {label}
        </Label>
        <Input onChange={(e) => onChange(e)} type={type} {...rest} />
        {error && <label className="text-danger">{error}</label>}
      </FormGroup>
    </>
  );
}
export function ImsInputCheck({ label, onChange, ...rest }) {
  return (
    <>
      <FormGroup check>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark mb-3"
          check
        >
          <Input type="checkbox" onChange={(e) => onChange(e)} {...rest} />
          <span className="form-check-sign" />
          {label}
        </Label>
      </FormGroup>
    </>
  );
}
export function CustomProgressBar({ isHorizontal, ...rest }) {
  return (
    <>
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        ></Label>
        <Col sm={isHorizontal ? "12 mx-auto" : "10 mx-auto"}>
          <Progress {...rest} />
        </Col>
      </Row>
    </>
  );
}
export function CustomAttachments({ label, attachments = [] }) {
  imsLogger("CustomFormElements", attachments);
  return (
    <>
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          {label}
        </Label>
        <Col sm="10 mx-auto">
          {attachments.map((data) => (
            <h6 className="my-3" key={data._id}>
              {data.key || data.Key}
            </h6>
          ))}
        </Col>
      </Row>
    </>
  );
}
export function ImsInputRadio({
  label,
  defaultChecked,
  onChange,
  md,
  values,
  ...rest
}) {
  return (
    <>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <FormGroup check className="form-check-radio">
        {values &&
          values.map((value, index) => (
            <Label
              style={{
                fontSize: "16px",
              }}
              className="text-dark me-3"
              check
              key={value + index}
            >
              <Input
                type="radio"
                checked={value === defaultChecked}
                onChange={(e) => onChange(e)}
                value={value}
                {...rest}
              />
              <span className="form-check-sign" />
              {value}
            </Label>
          ))}
      </FormGroup>
    </>
  );
}

export function ImsInputDate({
  label,
  name,
  value,
  onChange,
  error,
  disabled,
}) {
  return (
    <FormGroup>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <ReactDatetime
        inputProps={{
          disabled,
          placeholder: "Select date",
          className: "form-control",
          value,
          name,
          // this onchange is direct input ...
          onChange,
          autoComplete: "off",
        }}
        // this onchange is for calender ...
        onChange={(e) => {
          if (typeof e === "object") {
            let currentTarget = { name, value: e.format("D/M/YYYY") };
            onChange({ currentTarget });
          }
        }}
        timeFormat={false}
        dateFormat={"D/M/YYYY"}
      />
      {error && <label className="text-danger">{error}</label>}
    </FormGroup>
  );
}
export function ImsInputTime({
  label,
  name,
  value,
  onChange,
  error,
  disabled,
}) {
  return (
    <FormGroup>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <ReactDatetime
        dateFormat={false}
        inputProps={{
          disabled,
          className: "form-control",
          placeholder: "Select a time",
          value,
          name,
          // this onchange is direct input ...
          onChange,
          autoComplete: "off",
        }}
        // this onchange is for calender ...
        onChange={(e) => {
          if (typeof e === "object") {
            let currentTarget = { name, value: e.format("hh:mm a") };
            onChange({ currentTarget });
          }
        }}
        className="text-dark"
      />
      {error && <label className="text-danger">{error}</label>}
    </FormGroup>
  );
}

export function CustomDocUpload({ label, onUpload }) {
  return (
    <>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <Col sm="4">
        <DocUpload
          addBtnColor="success"
          changeBtnColor="default"
          onUpload={onUpload}
          changeBtnClasses={"btn-simple"}
          removeBtnClasses={"btn-simple"}
          addBtnClasses={"btn-simple"}
        />
      </Col>
    </>
  );
}
export function ImsImageUpload({ label, onUpload }) {
  return (
    <>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <Col sm="4">
        <ImageUpload
          addBtnColor="success"
          changeBtnColor="default"
          onUpload={onUpload}
          changeBtnClasses={"btn-simple"}
          removeBtnClasses={"btn-simple"}
          addBtnClasses={"btn-simple"}
        />
      </Col>
    </>
  );
}
export function CustomIconInputGroup({
  label,
  onChange,
  icon,
  type = "text",
  options,
  error,
  defaultOpt,
  selectedVal,
  ...props
}) {
  return (
    <Row>
      {label && (
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          {label}
        </Label>
      )}
      <Col sm={label && "10"}>
        <InputGroup>
          <InputGroupText>
            <i className={`tim-icons ${icon}`} />
          </InputGroupText>
          {options ? (
            <Input type="select" onChange={(e) => onChange(e)} {...props}>
              <option value={"undefined"}>{defaultOpt}</option>
              {options &&
                options.map((item, i) => (
                  <option key={item.value} value={item.value}>
                    {item.placeHolder}
                  </option>
                ))}
            </Input>
          ) : (
            <Input type={type} onChange={(e) => onChange(e)} {...props} />
          )}
        </InputGroup>
        {error && <label className="text-danger">{error}</label>}
      </Col>
    </Row>
  );
}
export function DocDelete({ ...rest }) {
  return (
    <>
      <Button
        {...rest}
        color="danger"
        size="sm"
        className="btn-icon  like btn-success"
      >
        <i className="ims-icons-20 icon-icon-trash-24" />
      </Button>
    </>
  );
}
export function DocDownload({ ...rest }) {
  return (
    <>
      <Button
        {...rest}
        color="success"
        size="sm"
        className="btn-icon  like btn-success"
      >
        <i className="tim-icons icon-cloud-download-93" />
      </Button>
    </>
  );
}
export function ImsInputSelect({ label, error, name, onChange, ...rest }) {
  return (
    <>
      <FormGroup>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          {label}
        </Label>
        <Select
          {...rest}
          onChange={(changes) => {
            if (!changes) {
              let currentTarget = {
                name,
                value: [],
              };
              onChange({ currentTarget });
            } else if (Array.isArray(changes)) {
              let currentTarget = {
                name,
                value: changes, //changes.map(item => item.value)
              };
              onChange({ currentTarget });
            } else {
              let currentTarget = {
                name,
                value: changes, //changes.value
              };
              onChange({ currentTarget });
            }
          }}
        />
        {error && <label className="text-danger">{error}</label>}
      </FormGroup>
    </>
  );
}
export function ImsButtonGroup({ children }) {
  return <>{children}</>;
}
export function CButton({ children, ...rest }) {
  return <Button {...rest}>{children}</Button>;
}

export function ImsInputDropZone({
  label,
  error,
  clearAll = false,
  onLoad,
  name,
  onChange,
  noMultiple,
  ...rest
}) {
  return (
    <FormGroup>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <FileDropZone
        {...rest}
        name={name}
        clearAll={clearAll}
        noMultiple={noMultiple}
        onLoad={(files) => onLoad(files)}
      />
    </FormGroup>
  );
}
export function ImsTextEditor({ label, error, name, onChange, ...rest }) {
  return (
    <FormGroup>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <TextEditor name={name} onChange={(e) => onChange(e)} {...rest} />
      {error && <label className="text-danger">{error}</label>}
    </FormGroup>
  );
}
export function ImsLocationPicker({ label, error, name, onChange, ...rest }) {
  return (
    <FormGroup>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
      >
        {label}
      </Label>
      <LocationPicker name={name} onChange={(e) => onChange(e)} {...rest} />
      {error && <label className="text-danger">{error}</label>}
    </FormGroup>
  );
}
export function ImsCommentGroup({ children }) {
  return <>{children}</>;
}
