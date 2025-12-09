import IMSSelectDropdown from "@/components/SelectDropdown/IMSSelectDropdown";
import { Button } from "@ims-systems-00/ims-ui-kit";
import DocumentTable from "./DocumentTable";

const SignatureRequests = ({ setTablePanel }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h4 className="mb-0">Signature Requests</h4>
        <div className="d-flex">
          <div>
            <IMSSelectDropdown
              onSelect={(value) => {}}
              showValue={true}
              // disabled={totalPages === 0}
              buttonText={"Received Requests"}
              listItems={[
                "Received Requests",
                "My Requests",
                // "Revision Requests",
              ]}
            />
          </div>
          <div className="ims-faded-button">
            <Button
              onClick={() => {
                setTablePanel("");
              }}
            >
              Back To Table
            </Button>
          </div>
        </div>
      </div>
      <DocumentTable />
    </div>
  );
};

export default SignatureRequests;
