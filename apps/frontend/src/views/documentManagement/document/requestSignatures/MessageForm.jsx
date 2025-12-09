import { Form } from "@ims-systems-00/ims-ui-kit";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { useRequestSignature } from "./store";
const MessageForm = ({}) => {
  const { messageFormControllers } = useRequestSignature();
  const { data, errors } = messageFormControllers.dataModel;
  return (
    <Form>
      <ImsInputText
        label="Message (Maximum 200 characters)"
        name="message"
        type="textarea"
        value={data.message}
        onChange={messageFormControllers.handleChange}
        error={errors.message}
        placeholder="Message..."
      />
    </Form>
  );
};

export default MessageForm;
