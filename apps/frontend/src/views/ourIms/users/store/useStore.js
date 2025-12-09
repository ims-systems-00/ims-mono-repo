import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import * as userApi from "../../../../services/userServices";
import {
  createInvitation,
  deleteInvitation,
  listInvitations,
  resendInvitation,
} from "../../../../services/invitationsService";
import {
  deleteMembership,
  changeMembershipRole,
  updateMembership,
} from "../../../../services/membershipService";
import filters from "../filters/filters";
import USER_ACTIONS from "./actions";
import useAlerts from "@/hooks/useAlerts";
import { resendVerificationEmail } from "@/services/authService";
import useCache from "@/hooks/useCache";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { useApplication } from "@/stores/applicationStore";
import useError from "@/hooks/error";

export default function useStore(config) {
  const { tokenPair } = useApplication();
  const { handleError } = useError();
  let id = config?.match?.params?.id || config?.view?._id;
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [visitingUser, setVisitingUser] = useState(null);
  const { cacheData } = useCache();
  const { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: { value: {} },
      filter: filters.find((item) => item.default),
    });
  const notify = useContext(NotificationContext);
  let { successAlert } = useAlerts();
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  function visitUser(user) {
    setVisitingUser(user);
  }
  const initiateAllData = () => {
    loadUser();
  };
  const fullReset = () => {
    setVisitingUser(null);
  };
  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_USER]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedData._id ? updatedData : user
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_USER]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  async function inviteUser(payload) {
    try {
      let { data } = await createInvitation({
        ...payload,
        role: payload.role.value,
      });
      setInvitations((prev) => [data.details.invitation, ...prev]);
      notify(payload.email + " is invited to your organisation.", "success");
    } catch (ex) {
      imsLogger("Users", ex, ex.response);
      handleError(ex);
    }
  }
  async function fetchUsers(qstr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_USERS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await userApi.getAllUsers({ query: qstr });
      setUsers(data.users);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_USERS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("Users", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_USERS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  useEffect(() => {
    fetchUsers(getQuery());
  }, [query]);

  async function loadUser() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_USER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await userApi.getUserWithClassifiedInfo(
        visitingUser?._id || id
      );
      visitUser(data.user);
      _dispatch({
        [USER_ACTIONS.LOAD_USER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_USER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("useUserManager", ex, ex.response);
    }
  }

  useEffect(() => {
    initiateAllData();
  }, [id]);
  const invitationsQueryHandlers = useQuery({
    required: { value: {} },
  });
  async function getSentInvitaions(qstr) {
    try {
      const { data } = await listInvitations({ query: qstr });
      setInvitations(data.details.invitations);
    } catch (err) {
      imsLogger(err);
    }
  }
  async function resendInvite(id) {
    try {
      const { data } = await resendInvitation(id);
      setInvitations((d) =>
        d.map((d) =>
          d._id === data.details.invitation._id ? data.details.invitation : d
        )
      );
      notify("Invitation resent", "success");
    } catch (err) {
      imsLogger(err);
    }
  }
  async function deleteInvite(id) {
    try {
      const { data } = await deleteInvitation(id);
      setInvitations((d) =>
        d.filter((d) => d._id !== data.details.invitation._id)
      );
      notify("Invitation removed", "success");
    } catch (err) {
      imsLogger(err);
    }
  }
  useEffect(() => {
    getSentInvitaions(invitationsQueryHandlers.getQuery());
  }, [invitationsQueryHandlers.query]);

  async function createUser(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_USER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await userApi.createUser(payload);
      notify(
        `${payload.firstName} ${payload.lastName} has been created successfully`,
        "success"
      );
      setUsers((u) => [data.user, ...u]);
      _dispatch({
        [USER_ACTIONS.CREATE_USER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("UserForm", ex.response || ex);
      notify(
        (ex.response && ex.response.data.message) ||
          "User create failed. Unknown error occurred",
        "danger"
      );
      _dispatch({
        [USER_ACTIONS.CREATE_USER]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function updateUser(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_USER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await userApi.updateUserInfo(visitingUser._id, payload);
      notify(`${data.user.name}'s profile updated successfully`, "success");
      setUsers((user) =>
        user.map((user) => (user?._id === data.user?._id ? data.user : user))
      );
      updateDataTable(data.user);
      _dispatch({
        [USER_ACTIONS.AMEND_USER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("UserForm", ex.response || ex);
      notify(
        (ex.response && ex.response.data.message) ||
          "User create failed. Unknown error occurred",
        "danger"
      );
      _dispatch({
        [USER_ACTIONS.AMEND_USER]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  const deleteUser = async (user) => {
    const membershipId = user?.membership.invitedUserId;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_USER]: {
          status: true,
          error: false,
          id: membershipId,
        },
      });
      let { data } = await deleteMembership(membershipId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== user._id)
      );
      notify(`User removed from your organisation.`, "success");
      _dispatch({
        [USER_ACTIONS.DELETE_USER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_USER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      handleError(ex);
    }
  };

  const grantAccess = async (user) => {
    const userId = user?._id;
    try {
      _dispatch({
        [USER_ACTIONS.GRANT_ACCESS]: {
          status: true,
          error: false,
          id: userId,
        },
      });
      let { data } = await userApi.changeImsAccess(userId, "status=Active");
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          return user._id === userId ? data.user : user;
        })
      );
      notify("Access granted successfully", "success");
      successAlert("A user granted access successfully");
      _dispatch({
        [USER_ACTIONS.GRANT_ACCESS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.GRANT_ACCESS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeavesTable", ex);
      notify(
        "Grant user access failed.Unknown server error occurred",
        "danger"
      );
    }
  };

  const revokeAccess = async (user) => {
    const userId = user?._id;
    try {
      _dispatch({
        [USER_ACTIONS.REVOKE_ACCESS]: {
          status: true,
          error: false,
          id: userId,
        },
      });
      let { data } = await userApi.changeImsAccess(userId, "status=Blocked");
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          return user._id === userId ? data.user : user;
        })
      );
      notify("Access revoked successfully", "success");
      successAlert("Access revoked successfully");
      _dispatch({
        [USER_ACTIONS.REVOKE_ACCESS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.REVOKE_ACCESS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeavesTable", ex);
      notify(
        "Revoke user access failed.Unknown server error occurred",
        "danger"
      );
    }
  };

  const resendVerification = async (user) => {
    const userId = user?._id;
    try {
      _dispatch({
        [USER_ACTIONS.RESEND_VERIFICATION]: {
          status: true,
          error: false,
          id: userId,
        },
      });
      let { data } = await resendVerificationEmail(userId);
      notify(
        `Verification email has been sent successfully to ${data?.user?.email}`,
        "success"
      );
      successAlert(
        `A verification email has been sent to ${data?.user?.email}`
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          return user._id === userId ? data.user : user;
        })
      );
      _dispatch({
        [USER_ACTIONS.RESEND_VERIFICATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.RESEND_VERIFICATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeavesTable", ex);
      notify(
        "Resend verification email failed.Unknown server error occurred",
        "danger"
      );
    }
  };

  const changeProfilePicture = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.RESEND_VERIFICATION]: {
          status: true,
          error: false,
          id: visitingUser._id,
        },
      });
      await userApi.changeProfilePic(visitingUser._id, payload);
      loadUser();
      cacheData();
      let key =
        visitingUser.profileImageInfo &&
        (visitingUser.profileImageInfo.key ||
          visitingUser.profileImageInfo.Key);
      deleteFileFromS3(key);
      notify(
        "Profile picture uploaded successfully. This may take a while to update across the system",
        "success"
      );
      _dispatch({
        [USER_ACTIONS.RESEND_VERIFICATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.RESEND_VERIFICATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeavesTable", ex);
      notify(
        "Profile picture change failed.Unknown server error occurred",
        "danger"
      );
    }
  };

  const updateMembershipInfo = async (id, updatedData) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_MEMBERSHIP]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await updateMembership(id, updatedData);
      await loadUser();
      notify("Employment details updated.", "success");
      _dispatch({
        [USER_ACTIONS.UPDATE_MEMBERSHIP]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.UPDATE_MEMBERSHIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
      handleError(ex);
    }
  };

  const cheangeRole = async (membershipId, role) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_MEMBERSHIP]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await changeMembershipRole(membershipId, role);
      await loadUser();
      notify("Role updated for this user.", "success");
      _dispatch({
        [USER_ACTIONS.UPDATE_MEMBERSHIP]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.UPDATE_MEMBERSHIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
      handleError(ex);
    }
  };

  return {
    users,
    setUsers,
    processing,
    toolState,
    getQuery,
    updatePagination,
    queryHandlers,
    visitingUser,
    fetchUsers,
    updateDataTable,
    createUser,
    visitUser,
    updateUser,
    deleteUser,
    grantAccess,
    revokeAccess,
    resendVerification,
    changeProfilePicture,
    invitations,
    invitationsQueryHandlers,
    inviteUser,
    resendInvite,
    deleteInvite,
    loadUser,
    cheangeRole,
    updateMembershipInfo,
  };
}
