import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import { Button, CustomInput } from "@ims-systems-00/ims-ui-kit";
import { useContext, useEffect } from "react";
const FixedPlugin = (props) => {
  let { profile } = useContext(SuperGlobalContext);
  useEffect(() => {
    profile &&
      props.initializeTheme({
        activeColor: profile.preferences.activeTheme,
        darkMode: profile.preferences.darkMode,
      });
  }, [profile]);
  return (
    <div className="fixed-plugin">
      <div className={props.classes}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            props.handleDropDownClick();
          }}
        >
          <i className="fa fa-cog fa-2x" />
        </a>
        <ul className="dropdown-menu show">
          <li className="header-title">SIDEBAR BACKGROUND</li>
          <li className="adjustments-line">
            <div className="badge-colors text-center">
              <span
                className={
                  props.activeColor === "primary"
                    ? "badge filter badge-primary active"
                    : "badge filter badge-primary"
                }
                data-color="primary"
                onClick={() => {
                  props.handleActiveClick("primary");
                }}
              />
              <span
                className={
                  props.activeColor === "blue"
                    ? "badge filter badge-info active"
                    : "badge filter badge-info"
                }
                data-color="info"
                onClick={() => {
                  props.handleActiveClick("blue");
                }}
              />
              <span
                className={
                  props.activeColor === "green"
                    ? "badge filter badge-success active"
                    : "badge filter badge-success"
                }
                data-color="success"
                onClick={() => {
                  props.handleActiveClick("green");
                }}
              />
              <span
                className={
                  props.activeColor === "orange"
                    ? "badge filter badge-warning active"
                    : "badge filter badge-warning"
                }
                data-
                onClick={() => {
                  props.handleActiveClick("orange");
                }}
              />
              <span
                className={
                  props.activeColor === "red"
                    ? "badge filter badge-danger active"
                    : "badge filter badge-danger"
                }
                data-color="danger"
                onClick={() => {
                  props.handleActiveClick("red");
                }}
              />
            </div>
          </li>
          <li className="header-title">FULL SIDEBAR</li>
          <li className="adjustments-line">
            <div className="togglebutton switch-sidebar-mini d-flex align-items-center justify-content-center">
              <span className="label-switch">OFF</span>
              <CustomInput
                type="switch"
                id="switch-1"
                onChange={props.handleMiniClick}
                value={!props.sidebarMini}
                checked={!props.sidebarMini}
                className="mt-n4"
              />
              <span className="label-switch ml-n3">ON</span>
            </div>
          </li>
          <li className="adjustments-line">
            <div className="togglebutton switch-change-color mt-3 d-flex align-items-center justify-content-center">
              <span className="label-switch">Dark mode</span>
              <CustomInput
                type="switch"
                id="switch-2"
                onChange={() => props.handleActiveMode(!props.darkMode)}
                value={!props.darkMode}
                checked={!props.darkMode}
                className="mt-n4"
              />
              <span className="label-switch ml-n3">Light mode</span>
            </div>
          </li>
          <li className="button-container mt-2">
            <Button
              block
              outline
              href="https://knowledge-base.imssystems.tech/"
              target="_blank"
            >
              <i className="nc-icon nc-paper" /> Knowledge Base
            </Button>
          </li>
          <li className="button-container">
            <Button
              href="https://imssystems.tech"
              color="primary"
              target="_blank"
              block
            >
              iMS Systems
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FixedPlugin;
