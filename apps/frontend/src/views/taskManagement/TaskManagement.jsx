import Tasks from "./Tasks";

const TaskManagement = ({ ...props }) => {
  return (
    <div className="content">
      <Tasks {...props} />
    </div>
  );
};

export default TaskManagement;
