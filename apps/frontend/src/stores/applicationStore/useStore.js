import useProcessingControl from "@/hooks/useProcessingControl";
import { useEffect, useState } from "react";
import http from "@/services/httpServices";
import USER_ACTIONS from "./actions";
import useAccessControl from "./hooks/useAccessControl";
import { useHistory } from "react-router-dom";
import { imsLogger } from "@/services/loggerService";
import useSocket from "@/hooks/useSocket";
import usePayment from "./hooks/usePayment";
import useImsFreezLoading from "./hooks/useImsFreezLoading";
// import usePayment from "./hooks/usePayment";

/**
 * this current refresh function is a very important function that tracks and only references a
 * single refresh function for all concurrent request to avoid reuse of same refresht token.
 */
let currentRefreshFunction = undefined;
export default function useStore(config) {
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const {
    initialLoadComplete,
    tokenPair,
    refreshToken,
    isLoggedIn,
    refreshCache,
    membershipData,
    updateTokenPair: _updateTokenPair,
    currentUserData,
    isUserVerified,
    getTrialDays,
    switchIntoOrganisation,
    switchIntoGroup,
    refreshMembershipData,
  } = useAccessControl();
  const history = useHistory();
  let { socketSubscriptionDetails } = useSocket();
  const paymentUtils = usePayment();
  const imsFreezLoadingUrils = useImsFreezLoading();
  function updateTokenPair(tokenPair) {
    http.setUserAccessWithJWT(tokenPair?.accessToken);
    _updateTokenPair(tokenPair);
  }
  useEffect(() => {
    refreshCache();
  }, []);
  useEffect(() => {
    let requestInterceptor = http.instance.interceptors.request.use(
      async (config) => config,
      (error) => {
        const expectedError =
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500;
        if (!expectedError) {
        }
        return Promise.reject(error);
      }
    );
    let responseInterceptor = http.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const expectedError =
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500;
        const needRefresh =
          expectedError &&
          error.response.status === 401 &&
          error.response.data?.message === "Invalid access token." &&
          !originalRequest._retry;
        if (needRefresh) {
          /** set the refresh function of not set */
          if (!currentRefreshFunction) currentRefreshFunction = refreshToken();
          let newTokenPair = await currentRefreshFunction;
          originalRequest.headers["x-auth-accesstoken"] =
            newTokenPair.accessToken;
          /** reset the refresh function so in future it can again detect reuse  */
          currentRefreshFunction = undefined;
          return http.instance(originalRequest);
        }
        if (
          expectedError &&
          error.response.data &&
          error.response.status === 440
        ) {
          window.location = "/auth/logout";
        }
        if (
          expectedError &&
          error.response.data &&
          error.response.data.message === "User unauthorized or login expired"
        ) {
          imsLogger("login expired", error.response);
          window.location = "/auth/logout";
        }
        if (
          expectedError &&
          error.response.data &&
          error.response.data.statusCode === 419 /** session expired */
        ) {
          localStorage.clear();
          alert(
            "Your current action requires you to login again. Your current session expired"
          );
          window.location = "/auth/logout";
        }
        return Promise.reject(error);
      }
    );
    return () => {
      http.instance.interceptors.request.eject(requestInterceptor);
      http.instance.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  return {
    processing,
    tokenPair,
    isApplicationReady: initialLoadComplete,
    refreshToken,
    isLoggedIn,
    currentUserData,
    isUserVerified,
    getTrialDays,
    refreshCache,
    updateTokenPair,
    socketSubscriptionDetails,
    switchIntoOrganisation,
    switchIntoGroup,
    membershipData,
    refreshMembershipData,
    ...paymentUtils,
    ...imsFreezLoadingUrils,
  };
}
