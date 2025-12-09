import useProcessingControl from "@/hooks/useProcessingControl";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import * as authService from "@/services/authService";
import * as userService from "@/services/userServices";
import httpService from "../../../services/httpServices";
import {
  getMembership,
  getMembershipFromCache,
  refreshMembershipCache,
} from "../../../services/membershipService";
import { useHistory } from "react-router-dom";
import { imsLogger } from "@/services/loggerService";
const SYSTEM_ACTIONS = {
  REFRESH_TOKEN: "refrsh-token",
};
/**
 * this hook not recomended to use outside of this store in anny component directly.
 * the store exposes utility function based on this hook to maintain ui logics.
 */
const processTokePairBeforeSave = (accessToken, refreshToken) => {
  let accessTokenData = jwtDecode(accessToken);
  let refreshTokenData = jwtDecode(refreshToken);
  return {
    accessToken,
    refreshToken,
    accessTokenData,
    refreshTokenData,
  };
};
export default function useAccessControl() {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [tokenPair, setTokenPair] = useState(null);
  const history = useHistory();
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(SYSTEM_ACTIONS).map((action) => {
      return { action: SYSTEM_ACTIONS[action] };
    })
  );
  function isLoggedIn() {
    if (tokenPair?.accessToken && tokenPair?.refreshToken) return true;
    return false;
  }
  /** following function initates user from cache at first load. */
  function _setCurrentUserData() {
    if (userService.getUserProfileFromCache()) {
      setCurrentUserData(userService.getUserProfileFromCache());
    }
    if (getMembershipFromCache()) {
      setMembershipData(getMembershipFromCache());
    }
  }
  function isUserVerified() {
    let _user = currentUserData || userService.getUserProfileFromCache();
    if (_user?.emailVerified?.status === "varified") return true;
    return false;
  }
  function getTrialDays(trailAllowed = 2) {
    let _user = currentUserData || userService.getUserProfileFromCache();
    const today = new Date();
    const end = new Date(_user?.createdAt);
    end.setDate(end.getDate() + trailAllowed);
    const diffInMs = end - today;
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }
  function updateTokenPair(tokenPair) {
    setTokenPair(
      processTokePairBeforeSave(tokenPair.accessToken, tokenPair.refreshToken)
    );
  }
  function getCurrentSessionData() {
    if (!tokenPair?.accessToken) return null;
    try {
      let data = jwtDecode(tokenPair?.accessToken);
      return data;
    } catch (ex) {
      return null;
    }
  }
  /**
   * this follwoing function sets the access tokens at the point when the full application
   * mounts. How this works:
   * Following function gets invoked. If the browser contains a valid refreshtoken cookie
   * it tries to refresh the token with an api request. in case of failiure we gracefully
   * logout the user or do all cleanups.
   *
   */
  async function refreshToken() {
    /**
     * we are only trying to initiate the application with a token
     * refresh if the browser contains user info in localstorage
     */
    if (!userService.getUserProfileFromCache()) {
      if (!initialLoadComplete) setInitialLoadComplete(true);
      return;
    }
    try {
      _dispatch({
        [SYSTEM_ACTIONS.REFRESH_TOKEN]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await authService.refreshToken();
      setTokenPair(
        processTokePairBeforeSave(data.accessToken, data.refreshToken)
      );
      httpService.setUserAccessWithJWT(data?.accessToken);
      _dispatch({
        [SYSTEM_ACTIONS.REFRESH_TOKEN]: {
          status: false,
          error: false,
          id: null,
        },
      });
      if (!initialLoadComplete) setInitialLoadComplete(true);
      return processTokePairBeforeSave(data.accessToken, data.refreshToken);
    } catch (err) {
      if (!initialLoadComplete) setInitialLoadComplete(true);
      history.push("/auth/logout");
      _dispatch({
        [SYSTEM_ACTIONS.REFRESH_TOKEN]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function switchIntoOrganisation(id) {
    if (!id) throw new Error("Org id is needed");
    httpService.setOrganisationAccess(id);
    const newTokenData = await refreshToken();
    await refreshMembershipData(
      newTokenData?.accessTokenData.user?.membershipId
    );
  }
  async function switchIntoGroup(id) {
    if (!id) throw new Error("Bu id is needed");
    httpService.setBusinessUnitAccess(id);
    const newTokenData = await refreshToken();
    await refreshMembershipData(
      newTokenData?.accessTokenData.user?.membershipId
    );
  }
  async function _cacheUserData() {
    if (tokenPair?.accessTokenData?.user?._id)
      try {
        let [profileRes] = await Promise.all([
          userService.getUserWithBasicInfo(
            tokenPair?.accessTokenData?.user?._id
          ),
        ]);
        userService.refreshProfileCache(profileRes.data.user);
        setCurrentUserData(profileRes.data.user);
        return profileRes.data.user;
      } catch (err) {
        imsLogger(err);
      }
  }
  async function refreshMembershipData(id) {
    if (tokenPair?.accessTokenData?.user?._id)
      try {
        let { data } = await getMembership(id);
        refreshMembershipCache(data.membership);
        setMembershipData(data.membership);
        return data.membership;
      } catch (err) {
        imsLogger(err);
      }
  }
  function refreshCache() {
    return _cacheUserData();
  }
  useEffect(() => {
    (async function () {
      await refreshToken();
      _setCurrentUserData();
    })();
  }, []);
  return {
    initialLoadComplete,
    tokenPair,
    refreshInProgress: processing[SYSTEM_ACTIONS.REFRESH_TOKEN].status,
    isLoggedIn,
    getCurrentSessionData,
    updateTokenPair,
    currentUserData,
    membershipData,
    isUserVerified,
    getTrialDays,
    refreshToken,
    refreshCache,
    switchIntoOrganisation,
    switchIntoGroup,
    refreshMembershipData,
  };
}
