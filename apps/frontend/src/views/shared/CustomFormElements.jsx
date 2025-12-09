import { useJsApiLoader } from "@react-google-maps/api";
import FileDropZone from "@/components/CustomUpload/FileDropZone";
import FormImageUpload from "@/components/CustomUpload/FormImageUpload";
import TextEditor from "@/components/Editors/TextEditor/Index";
import DirectionPicker from "@/components/Pickers/google/DirectionPicker";
import ReactDatetime from "react-datetime";
import "react-perfect-scrollbar/dist/css/styles.css";

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
import Select from "react-select";
import { imsLogger } from "@/services/loggerService";
import usePlacesAutocomplete from "use-places-autocomplete";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import DocUpload from "../../components/CustomUpload/DocUpload";
import ImageUpload from "../../components/CustomUpload/ImageUpload";
let ps;
export function ImsFormSectionDevider({ label, deviderText, isHorizontal }) {
  return (
    <>
      {/* <hr></hr> */}
      <Row>
        <Label
          sm={isHorizontal ? "12" : "2"}
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          {label}
        </Label>
        <Col sm={isHorizontal ? "12" : "10"}>
          <FormGroup>
            <span className="form-control border-0 text-warning">
              {deviderText}
            </span>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
export function ImsCommentBox({
  label,
  type = "text",
  mandatory = false,
  error,
  onChange,
  isHorizontal,
  ...rest
}) {
  return (
    <>
      <Row>
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
export function ImsInputText({
  label,
  type = "text",
  mandatory = false,
  error,
  onChange,
  isHorizontal = true,
  ...rest
}) {
  return (
    <>
      <Row className="">
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm={isHorizontal ? "2" : "12"}
        >
          {label} {mandatory ? <span className="text-danger">*</span> : ""}
        </Label>
        <Col sm={isHorizontal ? "10" : "12"}>
          <FormGroup>
            <Input onChange={(e) => onChange(e)} type={type} {...rest} />
            {error && <label className="text-danger">{error}</label>}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
export function ImsInputCheck({ label, onChange, isHorizontal, ...rest }) {
  return (
    <>
      <Row className="">
        {/* {label && <Label sm={isHorizontal ? "12" : "2"}>{label}</Label>} */}
        <Col sm="4">
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
export function CustomProgressBar({ isHorizontal, ...rest }) {
  return (
    <>
      <Row>
        <Label sm={isHorizontal ? "12" : "2"}></Label>
        <Col sm={isHorizontal ? "12" : "10"}>
          <Progress {...rest} />
        </Col>
      </Row>
    </>
  );
}
export function CustomAttachments({
  label,
  // isHorizontal = true,
  attachments = [],
}) {
  imsLogger("CustomFormElements", attachments);
  return (
    <>
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          //  sm={isHorizontal ? "2" : "12"}
          sm="2"
        >
          {label}
        </Label>
        <Col
          // sm={isHorizontal ? "10" : "12"}
          sm="10"
        >
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
  isHorizontal,
  values,
  ...rest
}) {
  return (
    <Row className="">
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="2"
      >
        {label}
      </Label>
      <Col
        className="checkbox-radios"
        md={isHorizontal ? `${md || "4"}` : "12"}
      >
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
      </Col>
    </Row>
  );
}

export function ImsInputDate({
  label,
  name,
  value,
  onChange,
  error,
  mandatory = false,
  disabled,
  lableCol = "2",
  inputCol = "10",
  isHorizontal,
}) {
  return (
    <Row className="ims-input p-5">
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm={isHorizontal ? "12" : "2"}
      >
        {label} {mandatory ? <span className="text-danger">*</span> : ""}
      </Label>
      <Col md={inputCol || "4"}>
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
  inputCol,
  onChange,
  error,
  disabled,
  isHorizontal,
}) {
  return (
    <>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm={isHorizontal ? "12" : "2"}
      >
        {label}
      </Label>
      <Col sm={inputCol || "4"}>
        <FormGroup>
          <ReactDatetime
            dateFormat={false}
            timeIntervals={30}
            timeFormat="HH:mm"
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
                let currentTarget = { name, value: e.format("HH:mm") };
                onChange({ currentTarget });
              }
            }}
            className="text-dark"
          />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </>
  );
}

export function CustomDocUpload({ label, onUpload, isHorizontal }) {
  return (
    <>
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm={isHorizontal ? "12" : "2"}
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
export function ImsImageUpload({
  label,
  imageUrl,
  name,
  onUpload,
  clearAll,
  user,
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
          sm={isHorizontal ? "12" : "2"}
        >
          {label}
        </Label>
        <Col sm="4">
          <ImageUpload
            imageUrl={imageUrl}
            name={name}
            clearAll={clearAll}
            addBtnColor="success"
            changeBtnColor="default"
            onUpload={onUpload}
            changeBtnClasses={"btn-simple"}
            removeBtnClasses={"btn-simple"}
            addBtnClasses={"btn-simple"}
            {...rest}
          />
        </Col>
      </Row>
    </>
  );
}
export function ImsFormImageUpload({
  label,
  imageUrl,
  onUpload,
  clearAll,
  user,
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
        <Col sm="4">
          <FormImageUpload
            imageUrl={imageUrl}
            clearAll={clearAll}
            addBtnColor="success"
            changeBtnColor="default"
            onUpload={onUpload}
            changeBtnClasses={"btn-simple"}
            removeBtnClasses={"btn-simple"}
            addBtnClasses={"btn-simple"}
            {...rest}
          />
        </Col>
      </Row>
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
  isHorizontal,
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
          sm={isHorizontal ? "12" : "2"}
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
export function ImsInputSelect({
  label,
  error,
  name,
  onChange = () => {},
  lableCol = "2",
  inputCol = "10",
  vertical = false,
  mandatory = false,
  isHorizontal = true,
  ...rest
}) {
  const handleChange = (changes) => {
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
  };

  return (
    <>
      {vertical ? (
        <Select {...rest} onChange={handleChange} />
      ) : (
        <Row className="">
          <Label
            style={{
              fontSize: "16px",
            }}
            className="text-dark"
            sm={isHorizontal ? "2" : "12"}
          >
            {label} {mandatory ? <span className="text-danger">*</span> : ""}
          </Label>
          <Col md={isHorizontal ? `${inputCol || "4"}` : "12"}>
            <FormGroup>
              <Select {...rest} onChange={handleChange} />
              {error && <label className="text-danger">{error}</label>}
            </FormGroup>
          </Col>
        </Row>
      )}
    </>
  );
}
export function ImsButtonGroup({ children, isHorizontal }) {
  return (
    <Row className="">
      {/* <Label sm={isHorizontal ? "12" : "2"}></Label> */}
      <Col sm={isHorizontal ? "12" : "10"}>{children}</Col>
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
  isHorizontal = true,
  ...rest
}) {
  return (
    <Row className="">
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm={isHorizontal ? "2" : "12"}
      >
        {label}
      </Label>
      <Col sm={isHorizontal ? "10" : "12"}>
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
export function ImsTextEditor({
  label,
  error,
  name,
  onChange = () => {},
  isHorizontal = true,
  ...rest
}) {
  return (
    <Row className="">
      {label && (
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm={isHorizontal ? "2" : "12"}
        >
          {label}
        </Label>
      )}
      <Col sm={isHorizontal && label ? "10" : "12"}>
        <FormGroup>
          <TextEditor
            onDataStructureChange={(draftDataStructure) =>
              onChange({ currentTarget: { name, value: draftDataStructure } })
            }
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            {...rest}
          />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
}
export function ImsDirectionPicker({
  label,
  travelMode,
  onChange,
  error,
  isHorizontal,
  ...rest
}) {
  return (
    <Row className="">
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm={isHorizontal ? "12" : "2"}
      >
        {label}
      </Label>
      <Col sm={isHorizontal ? "12" : "10"}>
        <FormGroup>
          <DirectionPicker
            travelMode={travelMode}
            onDirectionsPicked={(e) => onChange(e)}
            {...rest}
          />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
}
export function ImsCommentGroup({ children }) {
  return (
    <Row className="form-horizontal">
      {/* <Label sm={isHorizontal ? "12" : "2"}></Label> */}
      <Col sm="8">{children}</Col>
    </Row>
  );
}

export function ImsInputTextWithIcon({
  label,
  onChange,
  icon,
  type = "text",
  mandatory = false,
  options,
  error,
  defaultOpt,
  selectedVal,
  isHorizontal,
  ...props
}) {
  return (
    <Row className="">
      {label && (
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm={isHorizontal ? "12" : "2"}
        >
          {label} {mandatory ? <span className="text-danger">*</span> : ""}
        </Label>
      )}
      <Col sm={label && "10"}>
        <InputGroup>
          <InputGroupText addonType="prepend">
            <InputGroupText>
              <i className={`${icon}`} />
            </InputGroupText>
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
const googleLibraries = ["places"];
const SelectLocation = function ({
  label,
  error,
  name,
  lableCol = "2",
  inputCol,
  vertical = false,
  mandatory = false,
  onChange = () => {},
  ...rest
}) {
  const {
    setValue,
    suggestions: { status, data },
  } = usePlacesAutocomplete();
  const handleChange = (changes) => {
    if (!changes) {
      let currentTarget = {
        name,
        value: "",
      };
      onChange({ currentTarget });
    } else {
      let currentTarget = {
        name,
        value: changes.value,
      };
      onChange({ currentTarget });
    }
  };
  return (
    <>
      {vertical ? (
        <Select {...rest} onChange={handleChange} />
      ) : (
        <>
          <Label
            style={{
              fontSize: "16px",
            }}
            className="text-dark"
            sm={lableCol}
          >
            {label} {mandatory ? <span className="text-danger">*</span> : ""}
          </Label>
          <Col sm={inputCol || "10"}>
            <FormGroup>
              <Select
                placeholder={"Search location"}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={(e) => {
                  handleChange(e);
                }}
                onInputChange={(value) => {
                  setValue(value);
                }}
                options={
                  status === "OK"
                    ? data.map((place) => ({
                        value: place.description,
                        label: place.description,
                      }))
                    : []
                }
              />
            </FormGroup>
          </Col>
        </>
      )}
    </>
  );
};
export function ImsLocationPicker(props) {
  let { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: googleLibraries,
  });
  if (!isLoaded) return <span className="text-success">Loading picker...</span>;
  if (loadError)
    return (
      <span className="text-danger">Error occurred while loading picker.</span>
    );
  return <SelectLocation {...props} />;
}
