import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { RepositoriesContextProvider } from "../store";
import RepositoryOverview from "./RepositoryOverview";
import { AnalyticsDocumentContextProvider } from "./store";

const RepositoryOverviewIndex = () => {
  return (
    <RepositoriesContextProvider>
      <RepositoryOverview />
    </RepositoriesContextProvider>
  );
};

export default RepositoryOverviewIndex;
