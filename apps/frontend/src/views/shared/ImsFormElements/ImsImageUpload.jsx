import ImageUpload from "@/components/CustomUpload/ImageUpload";
import { Col, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsImageUpload = ({
  label,
  imageUrl,
  name,
  onUpload,
  clearAll,
  user,
  isHorizontal,
  ...rest
}) => {
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
};

export default ImsImageUpload;
