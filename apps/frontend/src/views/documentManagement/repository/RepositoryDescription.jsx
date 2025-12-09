import FormatedContents from "@/components/Editors/TextEditor/FormattedContents";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import useRepository from "./store/useRepository";

const RepositoryDescription = ({}) => {
  const { repository } = useRepository();
  return (
    <div className="repo-description-container mt-5 mb-3">
      <div className="repo-description">
        <h5 className="mb-2">Description:</h5>
        <p>
          {repository && repository?.description ? (
            <FormatedContents
              value={repository?.description}
              readOnly={true}
              mediaLinkGeneratorFn={linkGenerator}
            />
          ) : (
            `Add some description for this repository`
          )}
        </p>
      </div>
    </div>
  );
};

export default RepositoryDescription;
