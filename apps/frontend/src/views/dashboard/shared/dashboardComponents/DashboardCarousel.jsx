import {
  Card,
  CardBody,
  ImsCarousel,
  Progress,
} from "@ims-systems-00/ims-ui-kit";
import { Link } from "react-router-dom";
import StaffList from "./StaffList";
import StaffRemoteList from "./StaffRemoteList";
import Box from "@/components/Box/Index";

const DashboardCarousel = ({ dataSet, HoS, staffRemote, staff }) => {
  return (
    dataSet && (
      <ImsCarousel slidesPerView={3} navigation>
        <Box height={120}>
          <div>
            <div className="d-flex align-items-center">
              <i class="fa-solid fa-circle text-primary"></i>{" "}
              <span className="ms-2">Confidence level</span>
            </div>
            <h4 className="my-2">
              Organisational{" "}
              <span className="text-primary">
                {dataSet.organizationalConfidence}%
              </span>
            </h4>
            <Progress
              className="my-3"
              style={{ height: 10 }}
              value={dataSet.organizationalConfidence}
            />
          </div>
        </Box>
        <Link to="/admin/groups">
          <Box height={120}>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <p>Business Unit</p>
                <span className="icon-container-circle">
                  <i class="fa-solid fa-building"></i>
                </span>
              </div>
              <h3 className="my-2">{dataSet.businessFunctions} </h3>
            </div>
          </Box>
        </Link>
        <Box height={120}>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <p>Staff</p>
              <span className="icon-container-circle">
                <i class="fa-solid fa-user "></i>
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between my-3">
            <StaffList staff={staff} />
            <h4 className="my-2">
              {dataSet.numberOfStaffs} Member
              {dataSet.numberOfStaffs > 1 ? "s" : ""}
            </h4>
          </div>
        </Box>

        <Box height={120}>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <p
                style={{
                  color: "#152536",
                }}
              >
                Remote Staff
              </p>
              <span className="icon-container-circle">
                <i class="fa-solid fa-user "></i>
              </span>
            </div>
            <h3
              style={{
                color: "#17A2B8",
              }}
            >
              {dataSet.staffRemote} Member
              {dataSet.staffRemote > 1 ? "s" : ""}
            </h3>
          </div>
          <div>
            <StaffRemoteList staffRemote={staffRemote} />
          </div>
        </Box>
        {!HoS && (
          <Box height={120}>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <p
                  style={{
                    color: "#152536",
                  }}
                >
                  Compliance Bodies
                </p>
                <span className="icon-container-circle">
                  <i class="fa-solid fa-building "></i>
                </span>
              </div>
              <h1 className="my-1">{dataSet.complianceFunctions} </h1>
            </div>
          </Box>
        )}
      </ImsCarousel>
    )
  );
};

export default DashboardCarousel;
