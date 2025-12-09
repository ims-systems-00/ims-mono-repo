import DocUpload from "@/components/CustomUpload/DocUpload";
import { Col, Label } from "@ims-systems-00/ims-ui-kit";

const CustomDocUpload = ({ label, onUpload, isHorizontal }) => {
  return (
    <>
      <Label sm={isHorizontal ? "12" : "2"}>{label}</Label>
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
};

export default CustomDocUpload;
