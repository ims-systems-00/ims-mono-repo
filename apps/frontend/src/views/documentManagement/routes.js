import repositoriesRoutes from "./repositories/routes";
import repositoryRoutes from "./repository/routes";
import versionRoutes from "./document/routes";
import signaturesRoutes from "./signatures/routes";
const routes = [
  ...repositoriesRoutes,
  ...versionRoutes,
  ...repositoryRoutes,
  ...signaturesRoutes,
];

export default routes;
