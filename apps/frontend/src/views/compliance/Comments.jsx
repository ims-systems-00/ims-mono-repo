import { Form, Input } from "@ims-systems-00/ims-ui-kit";
import useComplianceComments from "./hooks/useComplianceComments";

const Comments = ({ data, updateDataTable, complianceTool }) => {
  const { updateComplianceComment } = useComplianceComments({
    data,
    updateDataTable,
    complianceTool,
  });

  return (
    <div className="text-center">
      <Form className="form">
        <Input
          className="no-scroll-bar p-2"
          type="textarea"
          placeholder="Comment"
          name="comment"
          defaultValue={data.comment}
          onBlur={updateComplianceComment}
        />
      </Form>
    </div>
  );
};

export default Comments;
