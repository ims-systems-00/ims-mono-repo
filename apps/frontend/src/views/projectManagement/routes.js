import ProjectManagement from "./ProjectManagement";
const routes = [
  {
    path: "/projectmanagement",
    name: "Project management",
    icon: "tim-icons icon-puzzle-10",
    component: ProjectManagement,
    layout: "/admin",
    screenIdentifier: "project-management",
    accessPolicy: {},
  },
];

export default routes;
