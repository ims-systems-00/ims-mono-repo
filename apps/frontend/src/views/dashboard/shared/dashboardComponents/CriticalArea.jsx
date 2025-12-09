import Box from "@/components/Box/Index";
import { CardTitle } from "@ims-systems-00/ims-ui-kit";

const CriticalArea = ({ dataSet }) => {
  return (
    <Box minHeight={150}>
      <div className="numbers">
        <div className="d-flex align-items-center">
          <i class="text-danger fa-solid fa-circle me-2"></i>{" "}
          <p className="card-category mx-2">Critical area</p>
        </div>
        <h3>{dataSet.criticalArea}</h3>
      </div>
    </Box>
  );
};

export default CriticalArea;
