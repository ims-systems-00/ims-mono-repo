import React from "react";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { updateComment } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";

const useComplianceComments = ({ data, updateDataTable, complianceTool }) => {
  async function updateComplianceComment({ currentTarget }) {
    try {
      data.comment = currentTarget.value;
      switch (complianceTool) {
        case IMS_SERVICES.DSPTNHS: {
          let { data: isoModules } = await updateComment({
            name: IMS_SERVICES.DSPTNHS,
            clause: data.clause,
            comment: data.comment,
          });
          updateDataTable(isoModules.compliance.module);
          break;
        }
        case IMS_SERVICES.ISO20000: {
          let { data: isoModules } = await updateComment({
            name: IMS_SERVICES.ISO20000,
            clause: data.clause,
            comment: data.comment,
          });
          updateDataTable(isoModules.compliance.module);
          break;
        }
        case IMS_SERVICES.ISO27001: {
          let { data: isoModules } = await updateComment({
            name: IMS_SERVICES.ISO27001,
            clause: data.clause,
            comment: data.comment,
          });
          updateDataTable(isoModules.compliance.module);
          break;
        }
        case IMS_SERVICES.ISO27002: {
          let { data: isoModules } = await updateComment({
            name: IMS_SERVICES.ISO27002,
            clause: data.clause,
            comment: data.comment,
          });
          updateDataTable(isoModules.compliance.module);
          break;
        }
        case IMS_SERVICES.ISO9001: {
          let { data: isoModules } = await updateComment({
            name: IMS_SERVICES.ISO9001,
            clause: data.clause,
            comment: data.comment,
          });
          updateDataTable(isoModules.compliance.module);
          break;
        }
        case IMS_SERVICES.ISO45001: {
          let { data: isoModules } = await updateComment({
            name: IMS_SERVICES.ISO45001,
            clause: data.clause,
            comment: data.comment,
          });
          updateDataTable(isoModules.compliance.module);
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("useComplianceComment", ex);
    }
  }

  return { updateComplianceComment };
};

export default useComplianceComments;
