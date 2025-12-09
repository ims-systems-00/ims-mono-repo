import classNames from "classnames";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import CollapseDrawerItems from "./CollapseDrawerItems";
import SupportButton from "./SupportButton";

const SidebarDrawer = ({
  slideMenu,
  setSlideMenu,
  slideMenuDetails,
  setSlideMenuDetails,
  slideMenuItemDetails,
  setSlideMenuItemDetails,
  activeCollapseSidebarItem,
  activeSidebarItem,
  ...props
}) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <React.Fragment>
      <div
        className={classNames("px-2 py-3 ims-slide-menu d-lg-block", {
          "ims-slide-menu-open": slideMenu === true,
        })}
      >
        {/* Drawer Menu Header and Cross Button */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "400",
            }}
            className="mb-0"
          >
            {slideMenuDetails.name}
          </h4>
          <Button
            size="sm"
            outline
            className="border border-0 shadow-none bg-transparent text-danger pr-0"
            color="danger"
            onClick={() => {
              setSlideMenu(false);
              setSlideMenuDetails({});
            }}
          >
            <i class="fa-solid fa-left-long"></i>
          </Button>
        </div>
        {/* Drawer Menu Items */}
        <div>
          {slideMenuDetails.collapse
            ? slideMenuDetails.views.map((prop, key) => {
                if (prop.redirect) {
                  return null;
                }
                if (prop.invisible) return null;

                if (prop.collapse) {
                  return (
                    <CollapseDrawerItems
                      slideMenu={slideMenu}
                      setSlideMenu={setSlideMenu}
                      slideMenuDetails={slideMenuDetails}
                      setSlideMenuDetails={setSlideMenuDetails}
                      slideMenuItemDetails={slideMenuItemDetails}
                      setSlideMenuItemDetails={setSlideMenuItemDetails}
                      activeCollapseSidebarItem={activeCollapseSidebarItem}
                      activeSidebarItem={activeSidebarItem}
                      {...prop}
                    />
                  );
                } else {
                  return (
                    <h4
                      onClick={() => {
                        history.push(prop.layout + prop.path);
                        setSlideMenu(false);
                        setSlideMenuItemDetails(prop);
                      }}
                      style={{
                        fontSize: "14px",
                        marginBottom: "12px",
                        padding: "8px",
                      }}
                      className={`slide-menu-items ${
                        slideMenuItemDetails.name &&
                        prop.name === slideMenuItemDetails.name &&
                        location.pathname.includes(prop.layout + prop.path)
                          ? "text-primary active-drawer-item"
                          : activeSidebarItem(prop.layout + prop.path) &&
                            "text-primary active-drawer-item"
                      }`}
                      key={key}
                    >
                      <i
                        className={`${prop.icon} me-3
                    
                    `}
                      />
                      {/* <img className="me-3" src={drawerIcon} alt="" /> */}
                      {prop.name}
                    </h4>
                  );
                }
              })
            : null}
        </div>
        {/* <SupportButton>
          <i class="fa-solid fa-question-circle text-primary me-3 "></i>
          Support
        </SupportButton> */}
      </div>
    </React.Fragment>
  );
};

export default SidebarDrawer;
