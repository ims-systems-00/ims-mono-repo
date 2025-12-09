import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";

const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/tasks`;

export function getTasks({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getTask(taskId) {
  return http.get(`${apiEndPoint}/${taskId}`);
}
export function getTopTasks() {
  return http.get(`${apiEndPoint}/analytics/toptasks`);
}
export function createTask(task) {
  return http.post(`${apiEndPoint}/`, {
    name: task.name,
    description: task.description,
    due: new Date(moment(task.due, "DD/MM/YYYY").toString().split("GMT")[0]),
    group: task.group.value,
    teamPriority: task.teamPriority,
    priority: task.priority.value,
    assignedTo: task.assignedTo.map((assignee) => assignee.value),
    attachments: task.attachments,
    moduleType: task.moduleType,
    module: task.module || null,
  });
}
export function updateTask(taskId, task) {
  return http.put(`${apiEndPoint}/${taskId}`, {
    name: task.name,
    description: task.description,
    due: new Date(moment(task.due, "DD/MM/YYYY").toString().split("GMT")[0]),
    group: task.group.value,
    teamPriority: task.teamPriority,
    priority: task.priority.value,
    assignedTo: task.assignedTo.map((assignee) => assignee.value),
    attachments: task.attachments,
  });
}
export function acceptTask(taskId, status) {
  return http.put(`${apiEndPoint}/${taskId}/assignments/`, {
    userId: getCurrentSessionData()?.user?._id,
    status: status,
  });
}
export function completeTask(taskId) {
  return http.put(`${apiEndPoint}/${taskId}/accomplishment/`, {
    completedBy: getCurrentSessionData().user._id,
  });
}
export function deleteTask(taskId) {
  return http.delete(`${apiEndPoint}/${taskId}`);
}
export function mapToTaskModel(task) {
  return {
    data: {
      group: task.group
        ? {
            value: task.group._id,
            label: task.group.name,
          }
        : {
            value: null,
            label: "Business unit",
          },
      teamPriority: task?.teamPriority || false,
      priority: task?.priority
        ? {
            value: task.priority,
            label: task.priority,
          }
        : {
            value: null,
            label: "Select priority",
          },
      assignedTo:
        task?.assignedTo?.map((assignee) => ({
          value: assignee.user?._id,
          label: assignee.user?.name,
        })) || [],
      name: task?.name,
      description: task?.description,
      due: task.due ? moment(task.due).format("DD/MM/YYYY") : "",
      attachments: [],
    },
    errors: {},
  };
}
export function mapToCommentModel(task) {
  return {
    data: {
      comment: task.comment,
    },
    errors: {},
  };
}
export function removeAttachment(id, attachment_id) {
  return http.delete(`${apiEndPoint}/${id}/attachments/${attachment_id}`);
}
