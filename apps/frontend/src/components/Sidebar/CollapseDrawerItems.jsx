import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Collapse } from "reactstrap";
import drawerIcon from "../../assets/img/app-indicator.svg";

const CollapseDrawerItems = ({
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
  const location = useLocation();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <React.Fragment>
      <div>
        <h4
          onClick={toggle}
          className="slide-menu-items "
          style={{
            fontSize: "14px",
            padding: "8px",
          }}
        >
          <div
            style={{
              cursor: "pointer",
            }}
            className="d-flex justify-content-between"
          >
            <span>
              <i
                className={`${props.icon} me-3
                    
                    `}
              />
              {props.name}
            </span>
            {isOpen ? (
              <span>
                <i className="ims-icons-20 icon-icon-caretdown-24"></i>
              </span>
            ) : (
              <span>
                <i className="ims-icons-20 icon-icon-caretup-24"></i>
              </span>
            )}
          </div>
        </h4>
        <Collapse isOpen={isOpen}>
          {props.views.map((prop, key) => {
            if (prop.redirect) return null;
            if (prop.invisible) return null;
            return (
              <div>
                <h4
                  style={{
                    fontSize: "14px",
                    padding: "8px",
                    paddingLeft: "17px",
                  }}
                  onClick={() => {
                    history.push(prop.layout + prop.path);
                    setSlideMenu(false);
                    setSlideMenuItemDetails(prop);
                  }}
                  className={`text-secondary  slide-menu-items 
                        ${
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
                  <span className="ml-4">{prop.name}</span>
                </h4>
              </div>
            );
          })}
        </Collapse>
      </div>
    </React.Fragment>
  );
};

export default CollapseDrawerItems;
