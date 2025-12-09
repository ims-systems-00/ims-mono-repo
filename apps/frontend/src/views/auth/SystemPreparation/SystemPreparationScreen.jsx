import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React, { useEffect } from "react";
import { useApplication } from "@/stores/applicationStore";
import Layout from "../Layout";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useSystemPreparation from "./useSystemPreparation";
const SystemPreparationScreen = () => {
  const {} = useSystemPreparation();
  return (
    <Layout>
      <div className="">
        <h4>Welcome to iMS Systems!</h4>
        <p className="mb-3">The future of business operations</p>
      </div>
      <div>
        <p>
          <Spinner size="sm" /> Please wait until we prepare the system for
          you...
        </p>
      </div>
    </Layout>
  );
};

export default SystemPreparationScreen;
