const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../triggers");
const { imsPaginationFormated } = require("../utility");
const { initialize } = require("../../initialize/initIsoModule");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CacheControl = require("../../cache/cacheControll");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.complianceCache = new CacheControl({
      cacheClient: 'redis',
      prefix: 'compliance',
      expireInSeconds: 600
    });
    this.imsPaginationFormated = imsPaginationFormated;
    this.ControlStatuses = models.controlstatuses(connection);
    this.ComplianceOverview = models.complianceoverviews(connection);
    this.ComplianceControls = models.compliancecontrols(connection);
    this.ControlEvidences = models.controlevidences(connection);
    this.initialize = initialize;
    this.fileHandler = new FileHandlerService(connection);
  }
  _calculateComplianceAlgo1(
    clause,
    selected,
    state,
    controls,
    updatedBy = null
  ) {
    let control = controls.find((control) => control.control.clause === clause);
    let parentClause = control.control.parentClause;
    let parentControl = controls.find(
      (control) => control.control.clause === parentClause
    );
    // logger.info("Current  : " + clause + "  " + "parent : " + parentClause, "  Compliance :" + state, "parent :" + parentControl)
    /**
     * update the selection status if current status does not match asking status
     */
    if (control.selected !== selected) {
      /** realxing the control that can be detected for database updates */
      control.__algorithom_relaxation = true;
      control.selected = selected;
      control.updated.by = updatedBy?._id || null;
      control.updated.on = Date.now();
    }
    if (!control.control.parentClause) {
      /** realxing the control that can be detected for database updates */
      control.__algorithom_relaxation = true;
      control.state = state;
      control.updated.by = updatedBy?._id || null;
      control.updated.on = Date.now();
      if (control.state === "Yes" || control.state === "Implemented") {
        control.compliancePercentage = 100;
      }
    }
    /**
     * update the implementation state if current status does not match asking state
     */
    if (control.state !== state) {
      /** realxing the control that can be detected for database updates */
      control.__algorithom_relaxation = true;
      /** realxing the parent control that can be detected for database updates */
      parentControl.__algorithom_relaxation = true;
      control.state = state;
      if (control.state === "Yes" || control.state === "Implemented") {
        control.compliancePercentage = 100;
      } else {
        control.compliancePercentage = control.control.childrenClauses.length
          ? Math.round(
              (control.numberOfCompliantChildren /
                control.control.childrenClauses.length) *
                100
            )
          : 0;
      }
      if (control.state === "Yes" || control.state === "Implemented") {
        parentControl.numberOfCompliantChildren += 1;
      } else {
        parentControl.numberOfCompliantChildren -= 1;
      }
      if (
        parentControl.numberOfCompliantChildren ===
          parentControl.control.childrenClauses.length &&
        control.control.parentClause
      ) {
        this._calculateComplianceAlgo1(
          parentControl.control.clause,
          "Selected",
          "Implemented",
          controls,
          updatedBy
        );
      } else {
        parentControl.compliancePercentage = Math.round(
          (parentControl.numberOfCompliantChildren /
            parentControl.control.childrenClauses.length) *
            100
        );
        let selected =
          parentControl.compliancePercentage > 0 ? "Selected" : "Not selected";
        this._calculateComplianceAlgo1(
          parentControl.control.clause,
          selected,
          "Not implemented",
          controls,
          updatedBy
        );
      }
    }
    return control;
  }
  _calculateComplianceAlgo2(controls) {
    // update total total compliance in this cool...
    let totalControls = controls.length;
    let implementedControls = controls.filter(
      (mod) => mod.state === "Implemented" || mod.state === "Yes"
    ).length;
    let totalPercentage = Math.round(
      (implementedControls / totalControls) * 100
    );
    let controlsImplemented = controls.filter(
      (mod) => mod.state === "Implemented"
    ).length;
    let controlsSelected = controls.filter(
      (mod) => mod.selected === "Selected"
    ).length;
    return {
      totalPercentage,
      controlsImplemented,
      controlsSelected,
    };
  }
  _calculateOverallCompliance(controls) {
    let roots = controls.filter((control) => !control.control.isLocked);
    let targetCompliance = roots.length * 100;
    let complianceAchived = roots.reduce(
      (total, current) => total + current.compliancePercentage,
      0
    );
    let totalPercentage = Math.round(
      (complianceAchived / targetCompliance) * 100
    );
    let controlsImplemented = controls.filter(
      (mod) => mod.state === "Implemented"
    ).length;
    let controlsSelected = controls.filter(
      (mod) => mod.selected === "Selected"
    ).length;
    return {
      totalPercentage,
      controlsImplemented,
      controlsSelected,
    };
  }
  
  _calculateComplianceAlgoV2(
    clause,
    selected,
    state,
    controls,
    updatedBy = null
  ) {
    let control = controls.find((control) => control.control.clause === clause);
    let parentClause = control.control.parentClause;
    let parentControl = controls.find(
      (control) => control.control.clause === parentClause
    );

    logger.info(
      "Current: " + clause + "  " + "parent: " + parentClause,
      "  Compliance: " + state,
      "parent: " + parentControl
    );

    control.__algorithom_relaxation = true;
    if (parentControl) parentControl.__algorithom_relaxation = true;

    // Update the selection status if current status does not match asking status
    if (control.selected !== selected) {
      control.selected = selected;
      control.updated.by = updatedBy?._id || null;
      control.updated.on = Date.now();
    }

    control.state = state;

    if (control.state === "Yes" || control.state === "Implemented") {
      control.compliancePercentage = 100;
      if (parentControl) {
        parentControl.numberOfCompliantChildren =
          parentControl.numberOfCompliantChildren + 1;
      }
    } else {
      const childrenClauses = control?.control?.childrenClauses;
      if (childrenClauses && childrenClauses.length > 0) {
        let totalChildrenCompliance = childrenClauses.reduce(
          (sum, childClause) => {
            let childControl = controls.find(
              (c) => c.control.clause === childClause
            );
            return sum + (childControl ? childControl.compliancePercentage : 0);
          },
          0
        );
        control.compliancePercentage = Math.round(
          (totalChildrenCompliance /
            (control.control.childrenClauses.length * 100)) *
            100
        );

        if (control.compliancePercentage === 100) {
          control.state = "Implemented";
          if (parentControl) {
            parentControl.numberOfCompliantChildren =
              parentControl.numberOfCompliantChildren + 1;
          }
        } else {
          if (parentControl) {
            parentControl.numberOfCompliantChildren = Math.max(
              parentControl.numberOfCompliantChildren - 1,
              0
            );
          }
        }
      } else {
        control.compliancePercentage = 0;
        if (parentControl) {
          parentControl.numberOfCompliantChildren = Math.max(
            parentControl.numberOfCompliantChildren - 1,
            0
          );
        }
      }
    }

    if (parentControl) {
      let parentSelected =
        parentControl.numberOfCompliantChildren ===
          parentControl.control.childrenClauses.length &&
        control.control.parentClause
          ? "Selected"
          : parentControl.compliancePercentage > 0
          ? "Selected"
          : "Not selected";

      let parentState =
        parentControl?.numberOfCompliantChildren ===
          parentControl?.control?.childrenClauses?.length &&
        control?.control?.parentClause
          ? "Implemented"
          : "Not implemented";

      // Recursively call the function to update the parent's parent
      this._calculateComplianceAlgoV2(
        parentControl.control.clause,
        parentSelected,
        parentState,
        controls,
        updatedBy
      );
    }

    return control;
  }
}
exports.Manager = Manager;
