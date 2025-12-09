import Analytics from "../common/Analytics";
import useCQC from "../hooks/useCqc";
const SiteOverview = ({ dataSet, overview }) => {
  const { getRatingClasses, getComplianceColors } = useCQC();
  return (
    <div className="content">
      <Analytics dataSet={dataSet} overview={overview} />
    </div>
  );
};

export default SiteOverview;
