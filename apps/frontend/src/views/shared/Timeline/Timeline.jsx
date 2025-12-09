import ActivityContextProvider from "./store/Context";
import TimelineContent from "./TimelineContent";

const Timeline = ({ moduleType, moduleId, metaInfo, readOnly = false }) => {
  return (
    <ActivityContextProvider
      moduleType={moduleType}
      moduleId={moduleId}
      metaInfo={metaInfo || null}
      readOnly={readOnly}
    >
      <TimelineContent />
    </ActivityContextProvider>
  );
};

export default Timeline;
