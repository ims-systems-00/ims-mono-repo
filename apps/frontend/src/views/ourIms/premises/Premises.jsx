import useQuery from "@/hooks/useQuery/index.js";
import React, { useEffect } from "react";
import { getGroupPremises } from "@/services/iamGroupPremisesServices";
import PremisesForm from "./PremisesForm";
import PremisesTable from "./PremisesTable";
import { imsLogger } from "@/services/loggerService";
import Box from "@/components/Box/Index";
import { DrawerRight } from "@ims-systems-00/ims-ui-kit";
import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import { deletePremise } from "@/services/iamGroupPremisesServices";

const Premises = (props) => {
  let [premises, setPremises] = React.useState([]);
  let [processing, setProcessing] = React.useState({
    action: "load-premises",
    id: null,
  });
  let notify = React.useContext(NotificationContext);
  let { successAlert } = useAlerts();

  let { query, getQuery, updatePagination, ...queryHandlers } = useQuery();

  const addToTable = (premise) =>
    setPremises((prevPremises) => [premise, ...prevPremises]);

  const fetchData = async (qStr) => {
    try {
      setProcessing({ action: "load-premises", id: null });
      let { data } = await getGroupPremises({ query: `${qStr}` });
      setPremises(data.iamGroupPremises);
      updatePagination(data.pagination);
    } catch (error) {
      imsLogger(error.response);
    }
    setProcessing({ action: null, id: null });
  };

  let updateDataTable = (updatedPremise) => {
    setProcessing({ action: "update", id: updatedPremise._id });
    setPremises((prevPremises) =>
      prevPremises.map((premise) =>
        premise._id === updatedPremise._id ? updatedPremise : premise
      )
    );
    setProcessing({ action: null, id: null });
  };

  let handleDelete = async (data) => {
    setProcessing({ action: "delete", id: data._id });
    try {
      await deletePremise(data._id);
      setPremises((prevPremises) =>
        prevPremises.filter((premise) => premise._id !== data._id)
      );
      notify("Premise Delete successfully", "success");
      successAlert("Deleted successfully");
    } catch (ex) {
      notify("Could not delete", "danger");
    }
    setProcessing({ action: null, id: null });
  };

  useEffect(() => {
    fetchData(getQuery());
  }, [query]);

  return (
    <div className="content">
      <Box>
        <PremisesTable
          dataTable={premises}
          processing={processing}
          setProcessing={setProcessing}
          setPremises={setPremises}
          pathname={props.match.url}
          queryHandlers={queryHandlers}
          updateDataTable={updateDataTable}
          handleDelete={handleDelete}
        />
      </Box>

      <DrawerRight drawerId="create-premise-drawer" size={50}>
        <div className="p-3">
          <h4 className="mb-4">Create a premise</h4>
          <PremisesForm
            {...props}
            setProcessing={setProcessing}
            processing={processing}
            addToTable={addToTable}
          />
        </div>
      </DrawerRight>
    </div>
  );
};

export default Premises;
