import Content from "./Content";
import { DeleteProcessProvider } from "./store";

const DeleteProcess = ({ onDelete = () => {} }) => {
  return (
    <DeleteProcessProvider onDelete={onDelete}>
      <Content />
    </DeleteProcessProvider>
  );
};

export default DeleteProcess;
