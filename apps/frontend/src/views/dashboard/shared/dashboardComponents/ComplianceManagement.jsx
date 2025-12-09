import Box from "@/components/Box/Index";
import ImsCircularProgressChart from "@/components/charts/ImsCircularProgressChart";
import useAccess from "@/hooks/useAccess";
import {
  ImsCarousel,
} from "@ims-systems-00/ims-ui-kit";
import { Link } from "react-router-dom";
import { IMS_SERVICES } from "@/rolesAndPermissions";

const ComplianceManagement = ({ dataSet, getComplianceColors }) => {
  let { authComplianceToolkitLicense } = useAccess();
  return (
    <Box minHeight={325}>
      <h4>Compliance</h4>
      <ImsCarousel slidesPerView={1} navigation>
        {authComplianceToolkitLicense(IMS_SERVICES.ISO14001) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso14001.data}
                options={dataSet.compliance.iso14001.options}
              />

              <p className="category text-center">
                <Link to="/admin/iso14001">ISO 14001 (2015)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO15686_5) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso15686_5.data}
                options={dataSet.compliance.iso15686_5.options}
              />

              <p className="text-primary">
                <Link to="/admin/iso15686-5">ISO 15686-5 (2017)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO20000) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso20000.data}
                options={dataSet.compliance.iso20000.options}
              />

              <p className="text-primary">
                <Link to="/admin/iso20000">ISO 20000 (2018)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO27001) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso27001.data}
                options={dataSet.compliance.iso27001.options}
              />
              <p className="text-primary">
                <Link to="/admin/iso27001">ISO 27001 (2013)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO27001_2022) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso27001_2022.data}
                options={dataSet.compliance.iso27001_2022.options}
              />

              <p className="text-primary">
                <Link to="/admin/iso27001-2022">ISO 27001 (2022)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO27001_2022_ANNEX_A) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso27001_2022_annex_a.data}
                options={dataSet.compliance.iso27001_2022_annex_a.options}
              />

              <p className="text-primary">
                <Link to="/admin/iso27001-2022-annex-a">
                  ISO 27001 (2022 ANNEX A)
                </Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO27002) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso27002.data}
                options={dataSet.compliance.iso27002.options}
              />
              <p className="text-primary">
                <Link to="/admin/iso27002">ISO 27002 (2013)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO9001) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso9001.data}
                options={dataSet.compliance.iso9001.options}
              />

              <p className="text-primary">
                <Link to="/admin/iso9001">ISO 9001 (2015)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.ISO45001) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.iso45001.data}
                options={dataSet.compliance.iso45001.options}
              />

              <p className="text-primary">
                <Link to="/admin/iso45001">ISO 45001 (2018)</Link>
              </p>
            </div>
          </Box>
        )}
        {authComplianceToolkitLicense(IMS_SERVICES.DSPTNHS) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.dsptNhs.data}
                options={dataSet.compliance.dsptNhs.options}
              />

              <p className="text-primary">
                <Link to="/admin/dspt">DSPT (2022)</Link>
              </p>
            </div>
          </Box>
        )}

        {authComplianceToolkitLicense(IMS_SERVICES.BS9997) && (
          <Box noShadow>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <ImsCircularProgressChart
                data={dataSet.compliance.bs9997.data}
                options={dataSet.compliance.bs9997.options}
              />

              <p className="text-primary">
                <Link to="/admin/bs9997">BS 9997 (2019)</Link>
              </p>
            </div>
          </Box>
        )}
      </ImsCarousel>
    </Box>
  );
};

export default ComplianceManagement;
