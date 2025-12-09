import Box from "@/components/Box/Index";

const OrgState = ({ dataSet }) => {
  return (
    <Box minHeight={150}>
      <div className="numbers">
        <div className="d-flex align-items-center">
          <i class="text-warning fa-solid fa-circle me-2"></i>{" "}
          <p className="card-category mx-2">Organisational State</p>
        </div>
        <h3>{dataSet.organizationalState}</h3>
      </div>
    </Box>
  );
};

export default OrgState;
