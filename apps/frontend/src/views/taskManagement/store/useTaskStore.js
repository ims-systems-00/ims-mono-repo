import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import useUsers from "@/hooks/useUsers";
import { useContext, useEffect, useState } from "react";
import { getCurrentSessionData } from "@/services/authService";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { nudgePeople } from "@/services/notificationService";
import * as taskManagementApi from "@/services/tasksServices";
import USER_ACTIONS from "../actions";
import filters from "../filters";

export default function useTaskStore(config) {
  const moduleType = config.moduleType ? config.moduleType : null;
  const module = config.module ? config.module : "";
  let moduleMatch = module ? { module: module } : {};
  const id = config.match && config.match.params.id;
  let notify = useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  let [tasks, setTasks] = useState([]);
  let [todoLists, setTodoLists] = useState([]);
  let [task, setTask] = useState(null);
  let [popAction, setPopAction] = useState(null);
  let handlePopAction = (action) => {
    setPopAction(action);
  };
  let linkedModuleType =
    task?.source?.moduleType !== "tasks" &&
    task?.source?.module?.type?.charAt(0).toLowerCase() +
      task?.source?.module?.type?.slice(1);
  let linkedURL =
    task?.source?.moduleType === "audits"
      ? `/admin/${task?.source.moduleType}/${linkedModuleType}/${task?.source?.module?._id}`
      : `/admin/${task?.source.moduleType}/${task?.source?.module?._id}`;
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const [modalFilter, setModalFilter] = useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };

  const today = new Date(); // Current date and time
  const yesterday = new Date(today); // Create a new date object with the current date
  yesterday.setDate(today.getDate() - 1); // Set the date to yesterday

  // Set the time to 23:59:59 for yesterday and today
  yesterday.setHours(23, 59, 59, 0);
  today.setHours(23, 59, 59, 0);

  let { users, lazyLoadUsers } = useUsers();

  const visitTask = (task) => {
    setTask(task);
  };

  const initiateAllData = () => {
    fetchTask();
  };

  const fullReset = () => {
    setTask(null);
  };
  const reloadTask = () => {
    fullReset();
    initiateAllData();
  };

  let TaskQueryTools = useQuery({
    required: {
      value: {
        userId: getCurrentSessionData()?.user?._id,
        source: {
          moduleType: moduleType === "tasks" ? {} : moduleType,
          ...moduleMatch,
        },
      },
    },
    filter: filters.find((item) => item.default),
  });

  let {
    query: todoQuery,
    toolState: todoToolState,
    getQuery: todoGetQuery,
    updatePagination: todoUpdatePagination,
  } = useQuery({
    required: {
      value: {
        assignedTo: {
          elemMatch: {
            acceptance: { ne: "Declined" },
            user: getCurrentSessionData()?.user?._id,
          },
        },
        // due: {
        //   gte: yesterday.getTime(),
        //   lte: today.getTime(),
        // },
      },
    },
  });

  const loadTodoLists = async (qstr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_TODOLISTS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await taskManagementApi.getTasks({ query: `${qstr}` });
      setTodoLists(data.tasks);
      todoUpdatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_TODOLISTS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("Task dashboard", ex, ex.response);
      notify("Unknown server error occurred while fetching tasks", "danger");
      _dispatch({
        [USER_ACTIONS.LOAD_TODOLISTS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  useEffect(() => {
    loadTodoLists(todoGetQuery());
  }, [todoQuery]);

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
    if (!task?._id && !id) return;
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_TASK]: {
          status: true,
          error: false,
          id: null,
        },
      });

      let { data } = await taskManagementApi.getTask(task?._id || id);
      visitTask(data.task);
      _dispatch({
        [USER_ACTIONS.LOAD_TASK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_TASK]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("useTask", ex, ex.response);
    }
  };
  const loadTasks = async (qstr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_TASKS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await taskManagementApi.getTasks({ query: `${qstr}` });
      setTasks((prevData) => [...data.tasks]);
      TaskQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_TASKS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("useTask", ex, ex.response);
      notify("Unknown server error occurred while fetching tasks", "danger");
      _dispatch({
        [USER_ACTIONS.LOAD_TASKS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const isCompletedTask = (task) => {
    return task.completed.status === "Complete";
  };
  const handleCreateTask = async (task) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_TASK]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await taskManagementApi.createTask(task);
      setTasks((prevTasks) => [data.task, ...prevTasks]);
      setTodoLists((prevTasks) => [data.task, ...prevTasks]);
      visitTask(data.task);
      notify("Task created successfully", "success");
    } catch (ex) {
      imsLogger("useTask", ex, ex.response);
      notify("Task create failed.Unknown server error occurred", "danger");
    }
    _dispatch({
      [USER_ACTIONS.CREATE_TASK]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };
  const handleUpdateDatatable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.UPDATE_TASK]: {
        status: true,
        error: false,
        id: updatedData._id,
      },
    });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedData._id ? updatedData : task
      )
    );
    _dispatch({
      [USER_ACTIONS.UPDATE_TASK]: {
        status: false,
        error: false,
        id: updatedData._id,
      },
    });
  };
  const handleUpdateTask = async (task, taskId) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_TASK]: {
          status: true,
          error: false,
          id: taskId,
        },
      });
      let { data } = await taskManagementApi.updateTask(taskId, task);
      visitTask(data.task);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === data.task._id ? data.task : task))
      );
      //   config.onUpdate && config.onUpdate(data.task);
      notify("Task updated successfully", "success");
      // viewContextData.switchView && viewContextData.switchView();
      _dispatch({
        [USER_ACTIONS.UPDATE_TASK]: {
          status: false,
          error: false,
          id: taskId,
        },
      });
    } catch (ex) {
      imsLogger("useTask", ex, ex.response);
      notify("Task update failed.Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.UPDATE_TASK]: {
          status: false,
          error: true,
          id: taskId,
        },
      });
    }
  };
  let handleRequestedTask = async (status, taskId) => {
    try {
      _dispatch({
        [USER_ACTIONS.REQUESTED_TASK]: {
          status: true,
          error: false,
          id: taskId,
        },
      });
      let { data } = await taskManagementApi.acceptTask(taskId, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === data.task._id ? data.task : task))
      );
      reloadTask();
      notify(`Task ${status.toLowerCase()} successfully`, "success");
      _dispatch({
        [USER_ACTIONS.REQUESTED_TASK]: {
          status: false,
          error: false,
          id: taskId,
        },
      });
    } catch (ex) {
      imsLogger("useTask", ex);
      notify("Task accept failed.Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.REQUESTED_TASK]: {
          status: false,
          error: true,
          id: taskId,
        },
      });
    }
  };

  let handleCompleteTask = async (taskId = null) => {
    try {
      _dispatch({
        [USER_ACTIONS.COMPLETE_TASK]: {
          status: true,
          error: false,
          id: task._id ? task._id : taskId,
        },
      });
      let { data } = await taskManagementApi.completeTask(
        task._id ? task._id : taskId
      );
      reloadTask();
      setTasks((pervTasks) =>
        pervTasks.map((task) => (task._id === data.task._id ? data.task : task))
      );
      //   config.onUpdate && config.onUpdate(data.task);
      notify("Task completed successfully", "success");
    } catch (ex) {
      imsLogger("useTask", ex);
      notify("Task complete failed.Unknown server error occurred", "danger");
    }
    _dispatch({
      [USER_ACTIONS.COMPLETE_TASK]: {
        status: false,
        error: false,
        id: task._id ? task._id : taskId,
      },
    });
  };
  let handleDeleteTask = async (taskId) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_TASK]: {
          status: true,
          error: false,
          id: taskId,
        },
      });
      let { data } = await taskManagementApi.deleteTask(taskId);
      setTasks((pervTasks) =>
        pervTasks.filter((task) => task._id !== data.task._id)
      );
      notify("Task deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_TASK]: {
          status: false,
          error: false,
          id: taskId,
        },
      });
    } catch (ex) {
      imsLogger("useTask", ex);
      notify("Task delete failed.Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_TASK]: {
          status: false,
          error: true,
          id: taskId,
        },
      });
    }
  };
  let handelNudgeOwner = async (taskId) => {
    try {
      _dispatch({
        [USER_ACTIONS.NUDGE_OWNER]: {
          status: true,
          error: false,
          id: taskId,
        },
      });

      await nudgePeople("tasks", taskId, "nudge-to-look-at-task");
      notify("Assignees has been notified successfully", "success");
      _dispatch({
        [USER_ACTIONS.NUDGE_OWNER]: {
          status: false,
          error: false,
          id: taskId,
        },
      });
    } catch (ex) {
      imsLogger("useTask", ex);
      notify(ex.response?.data?.message, "danger");
      _dispatch({
        [USER_ACTIONS.NUDGE_OWNER]: {
          status: false,
          error: true,
          id: taskId,
        },
      });
    }
  };
  async function handleDeleteAttachments(attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await taskManagementApi.removeAttachment(
        task._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitTask(data.task);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: false,
          error: false,
          id: attachment._id,
        },
      });
    } catch (ex) {
      imsLogger("useTask", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: false,
          error: true,
          id: attachment._id,
        },
      });
    }
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

  useEffect(() => {
    (async function () {
      await loadTasks(TaskQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [TaskQueryTools.query]);

  useEffect(() => {
    initiateAllData();
  }, [id]);

  useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  return {
    alert,
    users,
    task,
    setTask,
    fetchTask,
    tasks,
    processing,
    warningWithConfirmMessage,
    handleRequestedTask,
    TaskQueryTools,
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
    getAssignee,
    getStatusColor,
    popAction,
    handlePopAction,
    moduleType,
    module,
    todoLists,
    linkedURL,
    visitTask,
    reloadTask,
    modalFilter,
    toggleModalFilter,
  };
}
