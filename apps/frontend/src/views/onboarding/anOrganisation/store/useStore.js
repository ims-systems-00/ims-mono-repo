import NotificationContext from "@/contexts/notificationContext";
import { useContext, useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import * as organisationService from "../../../../services/organizationService";
import * as partnershipProgrammeService from "../../../../services/partnershipProgramService";
import { useApplication } from "@/stores/applicationStore";
import useError from "@/hooks/error";
import { imsLogger } from "@/services/loggerService";

export default function useStore(config) {
  const notify = useContext(NotificationContext);
  const { handleError } = useError();
  const [basicInfo, setBasicInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const [logoselection, setLogoselection] = useState(null);
  const [logo, setLogo] = useState(null);
  const [partnerCode, setPartnerCode] = useState(null);
  const { switchIntoOrganisation, tokenPair } = useApplication();
  const [creatingorg, setcreateingorg] = useState(false);
  const [loadingPartner, setLoadingPartner] = useState(false);
  const [partnerShip, setPartnership] = useState(null);
  const history = useHistory();
  const location = useLocation();
  let query = new URLSearchParams(location.search);
  function updateLogoSelection(d) {
    setLogoselection(d);
  }
  function updateBasicInfo(d) {
    setBasicInfo(d);
  }
  function updateAddress(d) {
    setAddress(d);
  }
  function updateLogo(d) {
    setLogo(d);
  }
  function updatePartnerCode(d) {
    setPartnerCode(d);
  }
  async function createOrganisation() {
    try {
      setcreateingorg(true);
      const { data } = await organisationService.createOrganisation({
        ...basicInfo,
        ...address,
        ...logo,
        ...partnerCode,
      });
      switchIntoOrganisation(data.organization._id);
      organisationService.removeCachedParnterCode();
      notify(data.message, "success");
      history.push("/auth/onboard/flow-selection");
    } catch (ex) {
      handleError(ex);
    }
    setcreateingorg(false);
  }
  async function loadPartnership(id) {
    try {
      setLoadingPartner(true);
      const { data } = await partnershipProgrammeService.getPartnership(id);
      setPartnership(data.partnership);
    } catch (ex) {
      imsLogger(ex);
    }
    setLoadingPartner(false);
  }
  useEffect(() => {
    /** every time this link loads with a partnercode it saves it for future use, until an organisation is created. */
    const automatedPartnerCode = query.get("partnerCode");
    if (automatedPartnerCode) {
      organisationService.cacheParnterCode(automatedPartnerCode);
      loadPartnership(automatedPartnerCode);
    }
    if (!tokenPair)
      return history.push("/auth/login?redirect=" + window.location.href);
  }, []);
  return {
    updateBasicInfo,
    updateAddress,
    updateLogo,
    updatePartnerCode,
    createOrganisation,
    updateLogoSelection,
    creatingorg,
    logoselection,
    loadingPartner,
    partnerShip,
    organization: {
      ...basicInfo,
      ...address,
      ...logo,
      ...partnerCode,
    },
  };
}
