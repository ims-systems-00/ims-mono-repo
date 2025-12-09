import { useContext, useEffect, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import * as documentManagmentApi from "@/services/documentManagement/index";
import USER_ACTIONS from "./actions";
import useProcessingControl from "@/hooks/useProcessingControl";
import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import IVal from "@/validations/validator";
export default function useRequestSignatureStore(config) {
  const notify = useContext(NotificationContext);
  const defaultSignatureConfig = {
    pageNumber: 1,
    pageX: 0.1,
    pageY: 0.1,
  };
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const dataSet = {
    data: {
      message: "",
    },
    errors: {},
  };
  const schema = {
    message: IVal.string().max(200).allow("", null).label("Message"),
  };
  const messageFormControllers = useForm(dataSet, schema);
  const [selectedInternalUserIds, setSelectedInternalUserIds] = useState([]);
  const [selectedExternalEmails, setSelectedExternalEmails] = useState([]);
  const [signaturePageNumber, setSignaturePageNumber] = useState(
    defaultSignatureConfig.pageNumber
  );
  // Updated to support multiple signature locations
  const [signatureLocations, setSignatureLocations] = useState([]);
  const [signatureCords, setSignatureCords] = useState({
    pageX: defaultSignatureConfig.pageX,
    pageY: defaultSignatureConfig.pageY,
  });

  function addToSelectedInternalUserIdsList(newuserid) {
    setSelectedInternalUserIds((prevuserids) => [...prevuserids, newuserid]);
  }
  function addToSelectedExternalEmailsList(newemail) {
    if (!selectedExternalEmails.includes(newemail))
      setSelectedExternalEmails((prevemails) => [...prevemails, newemail]);
  }
  function removeFromSelectedInternalUserIdsList(userid) {
    setSelectedInternalUserIds((prevuserids) =>
      prevuserids.filter((id) => id !== userid)
    );
  }
  function removeFromSelectedExternalEmailsList(email) {
    setSelectedExternalEmails((prevemails) =>
      prevemails.filter((e) => e !== email)
    );
  }
  function changeSignatureCords(pageX, pageY) {
    setSignatureCords({ pageX, pageY });
  }
  function toggleInternalUserIdInTheList(id) {
    selectedInternalUserIds.includes(id)
      ? removeFromSelectedInternalUserIdsList(id)
      : addToSelectedInternalUserIdsList(id);
  }
  function toggleAllInternalUsersInTheList(list) {
    selectedInternalUserIds.length === list.length
      ? setSelectedInternalUserIds([])
      : setSelectedInternalUserIds(list);
  }

  // Updated to check if signature locations are configured
  function hasSignaureConfigModifed() {
    return signatureLocations.length > 0;
  }

  function areAllConditionsComplete() {
    return (
      (selectedInternalUserIds.length || selectedExternalEmails.length) &&
      hasSignaureConfigModifed() &&
      !messageFormControllers.validate()
    );
  }

  // Updated to add new signature location to the list
  function modifySignatureConfig(data) {
    // Handle both single location and array of locations
    const locationsToAdd = Array.isArray(data) ? data : [data];

    locationsToAdd.forEach((locationData) => {
      const newLocation = {
        startX: locationData?.signaturePosition?.topLeftInPercentage?.x,
        startY: locationData?.signaturePosition?.topLeftInPercentage?.y,
        pageNumber: locationData?.pageNumber,
      };

      // Check if this location already exists
      const existingIndex = signatureLocations.findIndex(
        (loc) =>
          loc.pageNumber === newLocation.pageNumber &&
          Math.abs(loc.startX - newLocation.startX) < 0.01 &&
          Math.abs(loc.startY - newLocation.startY) < 0.01
      );

      if (existingIndex === -1) {
        setSignatureLocations((prev) => [...prev, newLocation]);
      }
    });

    // Keep the current cords for UI display (use the last location if multiple)
    if (locationsToAdd.length > 0) {
      const lastLocation = locationsToAdd[locationsToAdd.length - 1];
      setSignatureCords({
        pageX: lastLocation?.signaturePosition?.topLeftInPercentage?.x,
        pageY: lastLocation?.signaturePosition?.topLeftInPercentage?.y,
      });
      setSignaturePageNumber(lastLocation?.pageNumber);
    }
  }

  // Function to add a single signature location
  function addSignatureLocation(pageX, pageY, pageNumber) {
    const newLocation = {
      startX: pageX,
      startY: pageY,
      pageNumber: pageNumber,
    };

    // Check if this location already exists
    const existingIndex = signatureLocations.findIndex(
      (loc) =>
        loc.pageNumber === newLocation.pageNumber &&
        Math.abs(loc.startX - newLocation.startX) < 0.01 &&
        Math.abs(loc.startY - newLocation.startY) < 0.01
    );

    if (existingIndex === -1) {
      setSignatureLocations((prev) => [...prev, newLocation]);
      return true; // Successfully added
    }
    return false; // Already exists
  }

  // Function to remove a specific signature location
  function removeSignatureLocation(index) {
    setSignatureLocations((prev) => prev.filter((_, i) => i !== index));
  }

  // Function to clear all signature locations
  function clearSignatureLocations() {
    setSignatureLocations([]);
  }

  return {
    processing,
    selectedInternalUserIds,
    selectedExternalEmails,
    signaturePageNumber,
    signatureCords,
    signatureLocations,
    message: messageFormControllers.dataModel.data.message,
    messageFormControllers,
    changeSignatureCords,
    addToSelectedInternalUserIdsList,
    toggleAllInternalUsersInTheList,
    addToSelectedExternalEmailsList,
    removeFromSelectedExternalEmailsList,
    removeFromSelectedInternalUserIdsList,
    toggleInternalUserIdInTheList,
    hasSignaureConfigModifed,
    areAllConditionsComplete,
    modifySignatureConfig,
    addSignatureLocation,
    removeSignatureLocation,
    clearSignatureLocations,
  };
}
