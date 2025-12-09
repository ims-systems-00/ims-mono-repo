import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useQuery from "@/hooks/useQuery/index.js";
import useUsers from "@/hooks/useUsers";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentSessionData } from "@/services/authService";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { Badge } from "@ims-systems-00/ims-ui-kit";
import { nudgePeople } from "@/services/notificationService";
import {
  acceptTask,
  completeTask,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  removeAttachment,
  updateTask,
} from "@/services/tasksServices";
import filters from "../filters";
import { MyTaskTableActions } from "../TableActions";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";

const useTask = (initializers) => {
  initializers = initializers || {};
  let notify = useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  let [tasks, setTasks] = useState([]);
  let [task, setTask] = useState(null);
  let [processing, setProcessing] = useState({
    action: "initializing-data",
    id: null,
    error: false,
  });
  let history = useHistory();

  let { users, lazyLoadUsers } = useUsers();

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: { value: { userId: getCurrentSessionData()?.user?._id } },
      filter: filters.find((item) => item.default),
    });
  const authAcceptanceStatus = () => {
    let assignedTo = task ? task.assignedTo : [];
    let assignee =
      assignedTo &&
      assignedTo.find(
        (assign) => assign?.user?._id === getCurrentSessionData().user._id
      );
    return assignee ? assignee.acceptance : null;
  };
  const checkAssignedTo = (assignedTo = [], assignedBy, user) => {
    const assignedUser =
      assignedTo.filter((item) => item?.user?._id === user?.user?._id)[0] || {};
    if (assignedBy?._id === user?.user?._id) {
      return true;
    }
    return assignedUser?.acceptance === "Accepted";
  };
  const fetchTask = async () => {
    try {
      setProcessing({ action: "initializing-data" });
      let { data } = await getTask(initializers.taskId);
      setTask(data.task);
      setProcessing({ action: null, id: null, error: false });
    } catch (ex) {
      setProcessing({ action: null, id: null, error: true });
      imsLogger("useTask", ex, ex.response);
    }
  };
  const loadTasks = async (qstr) => {
    try {
      setProcessing({ action: "initializing-data", id: null });
      let { data } = await getTasks({ query: `${qstr}` });
      setTasks((prevData) => [...data.tasks]);
      updatePagination(data.pagination);
    } catch (ex) {
      imsLogger("useTask", ex, ex.response);
      notify("Unknown server error occurred while fetching tasks", "danger");
    }
    setProcessing({ action: null, id: null });
  };

  const isCompletedTask = (task) => {
    return task.completed.status === "Complete";
  };
  const handleCreateTask = async (task) => {
    try {
      setProcessing({ action: "creating-task" });
      let { data } = await createTask(task);
      setTasks((prevTasks) => [data.task, ...prevTasks]);
      notify("Task created successfully", "success");
      history.push(`/admin/tasks/${data.task._id}`);
    } catch (ex) {
      imsLogger("useTask", ex, ex.response);
      notify("Task create failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null });
  };
  const handleUpdateDatatable = (updatedData) => {
    setProcessing({ action: "update", id: updatedData._id });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedData._id ? updatedData : task
      )
    );
    setProcessing({ action: null, id: null });
  };
  const handleUpdateTask = async (task, viewContextData) => {
    try {
      setProcessing({ action: "updating-task" });
      let { data } = await updateTask(initializers.taskId, task);
      setTask(data.task);
      initializers.onUpdate && initializers.onUpdate(data.task);
      notify("Task updated successfully", "success");
      viewContextData.switchView && viewContextData.switchView();
    } catch (ex) {
      imsLogger("useTask", ex, ex.response);
      notify("Task update failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null });
  };
  let handleRequestedTask = async (status, taskId) => {
    try {
      setProcessing({ action: "changing-task-request-status", id: taskId });
      let { data } = await acceptTask(taskId, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === data.task._id ? data.task : task))
      );
      setTask(data.task);
      notify(`Task ${status.toLowerCase()} successfully`, "success");
    } catch (ex) {
      imsLogger("useTask", ex);
      notify("Task accept failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };

  let handleCompleteTask = async (viewContextData, taskId = null) => {
    try {
      setProcessing({
        action: "completing-task",
        id: initializers.taskId ? initializers.taskId : taskId,
      });
      let { data } = await completeTask(
        initializers.taskId ? initializers.taskId : taskId
      );
      setTask(data.task);
      viewContextData &&
        viewContextData.switchView &&
        viewContextData.switchView();
      setTasks((pervTasks) =>
        pervTasks.map((task) => (task._id === data.task._id ? data.task : task))
      );
      initializers.onUpdate && initializers.onUpdate(data.task);
      notify("Task completed successfully", "success");
    } catch (ex) {
      imsLogger("useTask", ex);
      notify("Task complete failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null });
  };
  let handleDeleteTask = async (taskId) => {
    try {
      setProcessing({ action: "deleting-task", id: taskId });
      let { data } = await deleteTask(taskId);
      setTasks((pervTasks) =>
        pervTasks.filter((task) => task._id !== data.task._id)
      );
      notify("Task deleted successfully", "success");
    } catch (ex) {
      imsLogger("useTask", ex);
      notify("Task delete failed.Unknown server error occurred", "danger");
    }
    setProcessing(false);
  };
  let handelNudgeOwner = async (taskId) => {
    try {
      setProcessing({ action: "nudge-owner", id: taskId });
      let { data } = await nudgePeople("tasks", taskId, "nudgeToLookAtTask");
      notify("Assignees has been notified successfully", "success");
    } catch (ex) {
      imsLogger("useTask", ex);
      notify(ex.response?.data?.message, "danger");
    }
    setProcessing({ action: null, id: null });
  };
  async function handleDeleteAttachments(attachment) {
    try {
      setProcessing({ action: "delete-attachment", id: attachment._id });
      let { data } = await removeAttachment(task._id, attachment._id);
      await deleteFileFromS3(attachment.key || attachment.Key);
      setTask(data.task);
      notify("Document deleted successfully", "success");
    } catch (ex) {
      imsLogger("useTask", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  }
  const getAssignee = (task) => {
    return task.teamPriority
      ? task.group?.name
      : task.assignedTo.length === 0
      ? "Own task"
      : task.assignedTo.map((assignee) => `${assignee.user?.name} `);
  };

  function getStatusColor(status) {
    switch (status) {
      case "Accepted":
        return "info";
      case "In progress":
        return "info";
      case "Declined":
        return "danger";
      case "Pending":
        return "warning";
      case "Not assigned":
        return "";
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "success";
    }
  }

  const _buildMyTaskTableRows = () =>
    tasks.map((data, key) => {
      return {
        id: data._id,
        reference: data.reference,
        name: data.name,
        due: <TimeDateComponent date={data.due} />,
        completed_on: data.completed.status && (
          <TimeDateComponent date={data.completed?.on} />
        ),
        assignedTo: getAssignee(data),
        status: <BadgeStatus status={data.completed.status} />,
        priority: (
          <span className={getStatusColor(data.priority)}>{data.priority}</span>
        ),
        // acceptedOn: data.accepted.on ? moment(data.accepted.on).format("DD/MM/YYYY") : "N/A",
        // taskOwner: data.created.by && data.created.by.name,
        // // assignedTo: data.assigned.to && data.assigned.to._id ? data.assigned.to.name : "Unassigned",
        // status: data.completed.status ? "Completed" :
        //   data.accepted.status === "Accepted" && data.assigned.to && data.assigned.to._id === getCurrentSessionData().user._id ?
        //     'Assigned to me' : data.accepted.status,
        // activateView: activateView,
        data: data,
        actions: <MyTaskTableActions data={data} />,
      };
    });

  useEffect(() => {
    if (initializers.taskId) {
      fetchTask();
    } else {
      loadTasks(getQuery());
    }
  }, [initializers.taskId, query]);

  useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  let myTasks = useMemo(_buildMyTaskTableRows, [processing]);

  return {
    alert,
    users,
    task,
    tasks,
    processing,
    setProcessing,
    warningWithConfirmMessage,
    myTasks,
    handleRequestedTask,
    toolState,
    queryHandlers,
    filters,
    authAcceptanceStatus,
    checkAssignedTo,
    loadTasks,
    handleCompleteTask,
    handleUpdateTask,
    handleCreateTask,
    handleDeleteTask,
    handelNudgeOwner,
    handleDeleteAttachments,
    handleUpdateDatatable,
    isCompletedTask,
  };
};

export default useTask;
