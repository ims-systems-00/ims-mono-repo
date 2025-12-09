import useProcessingControl from "@/hooks/useProcessingControl";
import { useContext, useEffect, useState } from "react";
import USER_ACTIONS from "./actions";
import useTemplateCompiler from "@/hooks/useTemplateCompiler";
import * as aiApi from "@/services/ai";
import useQuery from "@/hooks/useQuery";
import usePaginationState from "@/hooks/usePaginationState";
import NotificationContext from "@/contexts/notificationContext";
import { imsLogger } from "@/services/loggerService";
import moment from "moment";

export default function useStore(config) {
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  return {};
}
