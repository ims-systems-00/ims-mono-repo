import FileDropZone from "@/components/CustomUpload/FileDropZone";
import TextEditor from "@/components/Editors/TextEditor";
import LocationPicker from "@/components/Pickers/LocationPicker";
import {
  Button,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Progress,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import ReactDatetime from "react-datetime";
import Select from "react-select";
import { imsLogger } from "@/services/loggerService";
import DocUpload from "../../components/CustomUpload/DocUpload";
import ImageUpload from "../../components/CustomUpload/ImageUpload";

export function ImsInputText({
  label,
  type = "text",
  error,
  onChange,
  isHorizontal,
  ...rest
}) {
  return (
    <>
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm="2"
        >
          {label}
        </Label>
        <Col sm={isHorizontal ? "12" : "10"}>
          <FormGroup>
            <Input onChange={(e) => onChange(e)} type={type} {...rest} />
            {error && <label className="text-danger">{error}</label>}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
export function ImsInputCheck({ label, onChange, ...rest }) {
  return (
    <>
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm="2"
        ></Label>
        <Col sm="10">
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
        </Col>
      </Row>
    </>
  );
}
export function CustomProgressBar({ ...rest }) {
  return (
    <>
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm="2"
        ></Label>
        <Col sm="10">
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
          sm="2"
        >
          {label}
        </Label>
        <Col sm="10">
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
      <Label sm="2">{label}</Label>
      <Col className="checkbox-radios" md={md || "4"}>
        <FormGroup check className="form-check-radio">
          {values &&
            values.map((value, index) => (
              <Label
                style={{
                  fontSize: "16px",
                }}
                className="text-dark"
                check
                className="me-3"
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
      </Col>
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
    <Row>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      >
        {label}
      </Label>
      <Col sm="10">
        <FormGroup>
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
      </Col>
    </Row>
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
    <Row>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      >
        {label}
      </Label>
      <Col sm="10">
        <FormGroup>
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
      </Col>
    </Row>
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
        sm="2"
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
        sm="2"
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
          sm="2"
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
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm="2"
        >
          {label}
        </Label>
        <Col sm="10">
          <FormGroup>
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
        </Col>
      </Row>
    </>
  );
}
export function ImsButtonGroup({ children }) {
  return (
    <Row>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      ></Label>
      <Col sm="10">{children}</Col>
    </Row>
  );
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
    <Row>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      >
        {label}
      </Label>
      <Col sm="10">
        <FormGroup>
          <FileDropZone
            {...rest}
            name={name}
            clearAll={clearAll}
            noMultiple={noMultiple}
            onLoad={(files) => onLoad(files)}
          />
        </FormGroup>
      </Col>
    </Row>
  );
}
export function ImsTextEditor({ label, error, name, onChange, ...rest }) {
  return (
    <Row>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      >
        {label}
      </Label>
      <Col sm="10">
        <FormGroup>
          <TextEditor name={name} onChange={(e) => onChange(e)} {...rest} />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
}
export function ImsLocationPicker({ label, error, name, onChange, ...rest }) {
  return (
    <Row>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      >
        {label}
      </Label>
      <Col sm="10">
        <FormGroup>
          <LocationPicker name={name} onChange={(e) => onChange(e)} {...rest} />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
}
export function ImsCommentGroup({ children }) {
  return (
    <Row className="form-horizontal">
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      ></Label>
      <Col sm="10">{children}</Col>
    </Row>
  );
}
