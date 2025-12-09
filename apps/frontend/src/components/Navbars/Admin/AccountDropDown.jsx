import React from "react";
import classNames from "classnames";
import {
  NavLink,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";

import { useEffect, useState } from "react";
import { getCurrentSessionData } from "@/services/authService";
import {
  getUserWithClassifiedInfo,
  switchAccessPolicy,
} from "@/services/userServices";

import { useApplication } from "@/stores/applicationStore";
import KBEmbeded from "@/components/KnowledgeBase/Index";

const AccountDropdown = ({ notification }) => {
  /**
   * TODO : Profile picture liniing to be changed
   */
  let [user, setUser] = useState({});
  let [dropdownOpen, setDropdownOpen] = useState(false);
  let toggle = () => setDropdownOpen((prevState) => !prevState);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { updateTokenPair } = useApplication();
  useEffect(() => {
    window.addEventListener("resize", () => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      handleResize();
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getUserWithClassifiedInfo(
          getCurrentSessionData() && getCurrentSessionData().user?._id
        );
        setUser(data.user);
      } catch (err) {}
    }
    getCurrentSessionData() && fetchData();
  }, []);
  async function switchAccess(id) {
    try {
      const { data } = await switchAccessPolicy(
        getCurrentSessionData() && getCurrentSessionData().user?._id,
        id
      );
      updateTokenPair({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
      });
      window.location = "/admin/dashboard";
    } catch (err) {}
  }
  // AccountDropdown container  ...
  return (
    <React.Fragment>
      <UncontrolledDropdown>
        <DropdownToggle
          className="bg-transparent border-0 shadow-none px-0 d-flex align-items-center"
          caret
          size="sm"
        >
          <div className="photo m-0 p-0 border">
            <img alt="..." src={user.profileImageSrc} />
          </div>
          <span className="px-1">{user.firstName}</span>
        </DropdownToggle>
        <DropdownMenu
          end={windowWidth > 991 ? true : false}
          key={"profile-dropdown"}
          className="mt-lg-2 account-dropdown-menu"
          tag="ul"
          style={{
            maxHeight:
              windowWidth > 991 ? "calc(100vh - 100px)" : "calc(100vh - 50vh)",
            overflowY: "auto",
            //hide scrollbar
            msOverflowStyle: "none" /* IE and Edge */,
            scrollbarWidth: "none" /* Firefox */,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <NavLink tag="li">
            <DropdownItem
              className="nav-item admin-nav-item font-weight-bold "
              href={`/admin/users/${
                getCurrentSessionData() && getCurrentSessionData().user?._id
              }`}
            >
              {user.name}
            </DropdownItem>
          </NavLink>
          <DropdownItem divider tag="li" />
          <NavLink key={"organisation-profile"} tag="li">
            <DropdownItem
              className="nav-item admin-nav-item"
              href={`/admin/organisation`}
            >
              My organisation
            </DropdownItem>
          </NavLink>
          <DropdownItem divider tag="li" />
          <NavLink key={"changepassword-dropdown"} tag="li">
            <DropdownItem
              className="nav-item admin-nav-item"
              href={`/auth/users/${
                getCurrentSessionData() && getCurrentSessionData().user?._id
              }/changepassword`}
            >
              Change Password
            </DropdownItem>
          </NavLink>
          <DropdownItem divider tag="li" />
          {user._id &&
            user?.accessPolicies.map((policy) => (
              <React.Fragment>
                <NavLink key={policy?._id} tag="li">
                  <DropdownItem
                    className={classNames("nav-item admin-nav-item", {
                      "text-primary nav-item-active":
                        policy?.group?.name ===
                        getCurrentSessionData().user?.current?.group?.name,
                    })}
                    onClick={() => switchAccess(policy?._id)}
                  >
                    {policy?.group?.name}
                  </DropdownItem>
                </NavLink>
                <DropdownItem divider tag="li" />
              </React.Fragment>
            ))}
          <NavLink tag="li">
            <DropdownItem
              className="nav-item admin-nav-item"
              href="/auth/logout"
            >
              Log out
            </DropdownItem>
          </NavLink>
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );
};
export default AccountDropdown;
