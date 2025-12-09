import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import Layout from "../Layout";
import useOrgChoice from "./useOrgChoice";
import PerfectScrollbar from "react-perfect-scrollbar";
import useMemberships from "@/hooks/useMemberships";
const SystemPreparationScreen = () => {
  const { hanldeSelect } = useOrgChoice();
  const { memberships, loadingMemberships } = useMemberships();
  return (
    <Layout>
      <div className="">
        <h5 className="text-dark">Elevate Your Business Operations</h5>
        <p className="mb-3">Please check-in to relevant organisation.</p>
      </div>
      <div className="org-selection-container">
        <PerfectScrollbar>
          {loadingMemberships ? (
            <p>
              <Spinner size="sm" /> Please wait until we prepare the system for
              you...
            </p>
          ) : (
            <React.Fragment>
              {memberships.map((m) => (
                <div
                  className="org-name rounded-3 border border-primary shadow-sm p-3 mb-2"
                  onClick={() => {
                    hanldeSelect(m);
                  }}
                >
                  {m.organization?.name}
                  <small className="pull-right">
                    {m.organization.isCustomer && (
                      <i
                        title="Customer"
                        className="ims-icons-20 icon-icon-users-24"
                      />
                    )}
                    {m.organization.isPartner && (
                      <i
                        title="Partner"
                        className="ims-icons-20 icon-icon-handshake-24"
                      />
                    )}
                  </small>
                </div>
              ))}
              {/* </ImsCarousel> */}
            </React.Fragment>
          )}
        </PerfectScrollbar>
      </div>
    </Layout>
  );
};

export default SystemPreparationScreen;
