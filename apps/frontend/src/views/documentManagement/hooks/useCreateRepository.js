import NotificationContext from "@/contexts/notificationContext";
import { useContext, useState } from "react";
import * as documentManagmentApi from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
export default function useCreateRepository() {
  const notify = useContext(NotificationContext);
  async function createRepository(payload) {
    try {
      let { data } = await documentManagmentApi.createRepository(payload);
      notify("Repository created successfully", "success");
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.message || "Server error occured. Please try again later.",
        "danger"
      );
    }
  }
  return { createRepository };
}
