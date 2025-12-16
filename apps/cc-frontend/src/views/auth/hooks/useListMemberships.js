import { useState, useEffect } from "react";
import useAPIResponse from "../../../hooks/apiResponse";
import { listMemberships as listMembershipsService } from "../../../services/membershipService";

export const useListMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useAPIResponse();

  const fetchMemberships = async () => {
    try {
      setIsLoading(true);
      const membershipRes = await listMembershipsService();

      const memberships = membershipRes.data?.details?.memberships || [];

      const validMemberships = memberships.filter(
        (membership) =>
          membership?.organization?._id &&
          typeof membership.organization._id === "string" &&
          membership.organization._id.trim() !== ""
      );

      setMemberships(validMemberships);
    } catch (err) {
      handleError(err);
      setMemberships([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return {
    memberships,
    isLoading,
    listMemberships: fetchMemberships,
  };
};
