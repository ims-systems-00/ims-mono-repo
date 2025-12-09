import TimeLine from "@/views/shared/Timeline/Timeline";
import useRepository from "./store/useRepository";
const DocumentActivity = () => {
  const { detailsOfSelectedChild, processing } = useRepository();
  return (
    <div>
      {detailsOfSelectedChild?._id ? (
        <TimeLine
          moduleType="documenttrees"
          moduleId={detailsOfSelectedChild?._id}
        />
      ) : (
        <span className="text-center text-secondary">No activity to show</span>
      )}
    </div>
  );
};

export default DocumentActivity;
