const { ComplianceToolCRUDOps } = require("./compliance");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const { APIError } = require("openai");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
class ControlsManager extends ComplianceToolCRUDOps {
  constructor(connection) {
    super(connection);
  }
  
  async _updateControlAlog2(data) {
    let { name, clause, state, selected, user } = data;
    if (selected === "Not selected" && state !== "Not implemented")
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No control selected. Select a control before implementing."
      );
    let controls = await this.ControlStatuses.findByOrg(
      this.connection.user.organizationId,
      { name }
    );
    let populatedControls = await Promise.all(
      controls.map((control) => this.ControlStatuses.populateControl(control))
    );
    let currentControl = populatedControls.find(
      (control) => control.control.clause === clause
    );
    let control = await this.ControlStatuses.findOneAndUpdate(
      { _id: currentControl._id },
      {
        $set: {
          state,
          selected,
          compliancePercentage:
            state === "Implemented" || state === "Yes" ? 100 : 0,
          "updated.on": Date.now(),
          "updated.by": user._id,
        },
      },
      { new: true }
    );
    let populatedControl = await this.ControlStatuses.populateControl(control);
    populatedControls = populatedControls.map((pControl) =>
      pControl._id.toString() === populatedControl._id.toString()
        ? populatedControl
        : pControl
    );
    let { totalPercentage, controlsImplemented, controlsSelected } =
      this._calculateComplianceAlgo2(populatedControls);
    await this.ComplianceOverview.findOneAndUpdateByOrg(
      this.connection.user.organizationId,
      { name },
      { $set: { totalPercentage, controlsImplemented, controlsSelected } }
    );
    return populatedControl;
  }
  async _updateControlAlog1(data) {
    let { name, clause, state, selected, user } = data;
    if (selected === "Not selected" && state !== "Not implemented")
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Please select the control."
      );
    let date = Date.now();
    let controls = await this.ControlStatuses.findByOrg(
      this.connection.user.organizationId,
      { name }
    );
    logger.info("Fetch time...", { date: (Date.now() - date) / 1000 });
    date = Date.now();
    let populatedControls = await Promise.all(
      controls.map((control) => this.ControlStatuses.populateControl(control))
    );

    logger.info("populatedControls", populatedControls);

    logger.info(`All Population time... ${(Date.now() - date) / 1000}`);
    date = Date.now();
    /**
     * Each populated control gets muted inside the algorithom.
     * Hence these populated controls are used to update the databases directly later in this function.
     */
    let control = this._calculateComplianceAlgoV2(
      clause,
      selected,
      state,
      populatedControls,
      user
    );
    logger.info(`Algo time... ${(Date.now() - date) / 1000}`);
    const { totalPercentage, controlsImplemented, controlsSelected } =
      this._calculateOverallCompliance(populatedControls);

    logger.info("control", {control});

    /**
     * this is the updated control for sending to client.
     * resultent control updates are not to client side.
     */
    let populatedControl = await this.ControlStatuses.populateControl(control);
    date = Date.now();
    let triggeredControls = populatedControls.filter(
      (c) => c.__algorithom_relaxation
    );
    await Promise.all(
      triggeredControls.map((control) => {
        logger.info("updated: ", { clause: control?.control?.clause });
        return this.ControlStatuses.findOneAndUpdateByOrg(
          this.connection.user.organizationId,
          { _id: control._id },
          {
            $set: {
              compliancePercentage: control.compliancePercentage,
              state: control.state,
              selected: control.selected,
              numberOfCompliantChildren: control.numberOfCompliantChildren,
              "updated.on": Date.now(),
              "updated.by":
                control.updated?.by?._id || control.updated?.by || null,
            },
          },
          { new: true }
        );
      })
    );
    logger.info(`All Save time... ${(Date.now() - date) / 1000}`);
    date = Date.now();
    await this.ComplianceOverview.findOneAndUpdateByOrg(
      this.connection.user.organizationId,
      { name },
      { $set: { totalPercentage, controlsImplemented, controlsSelected } }
    );
    logger.info(`Overview save time... ${(Date.now() - date) / 1000}`);
    return populatedControl;
  }
  
  async getControl(query) {
    let controlRef = await this.ComplianceControls.findOne(query);
    if (controlRef.isLocked)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This control is not allowed to update manually."
      );
    let control = await this.ControlStatuses.findOneByOrg(
      this.connection.user.organizationId,
      {
        control: controlRef?._id,
      }
    );
    if (!control)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No control found."
      );
    return this.ControlStatuses.populateControl(control);
  }
  async updateControlStatus(data) {
    let { name, state, selected, clause, user } = data;
    let prevControl = await this.getControl({ name, clause });
    if (prevControl.state === state && prevControl.selected === selected) {
      logger.info(
        "control is already same state. skipping algorithom runner..."
      );
      logger.info(`for  ${(clause, prevControl.state === state)}`);
      return prevControl;
    }
    let updatedControl;
    if (name === IMS_SERVICES.ISO27002 || name === IMS_SERVICES.DSPTNHS)
      updatedControl = await this._updateControlAlog2(data);
    else updatedControl = await this._updateControlAlog1(data);
    if (state === "Implemented" || state === "Yes") {
      mainChannel.topic(SERVER_EVENTS_BUS.CONTROL_COMPLIANCE_UPDATES).emit({
        accessControl: this.connection,
        control: updatedControl,
      });
      // this.trigger.sendNotification(
      //   "controlComplianceUpdates",
      //   updatedControl
      //   // { email: true }
      // );
      let activityLog = "";
      if (data.imsAutomated)
        activityLog = `
Your evidence against this control  is iMS Systems ${updatedControl?.control?.moreInfo?.applicableModulesLabel} module(s).
You can now upload further evidence against this control i.e. documents, policies and SOP's and you can link them to this control.
            `;
      else
        activityLog = `This control has been selected and implemented by ${user?.name}.`;
      mainChannel.topic(SERVER_EVENTS.CONTROL_BECAME_COMPLIANT).emit({
        accessControl: this.connection,
        control: updatedControl,
        message: activityLog,
        user: user,
      });
      // eventEmitter.emit(SERVER_EVENTS.CONTROL_BECAME_COMPLIANT, {
      //   accessControl: this.connection,
      //   control: updatedControl,
      //   message: activityLog,
      //   user: user,
      // });
    }
    this.complianceCache.clearAll();
    return updatedControl;
  }

  async updateControl(data) {
    let { id, user, ...updateData } = data;
        
    let control = await this.ControlStatuses.findOneByOrg(
      this.connection.user.organizationId,
      { _id: id }
    );
    
    if (!control) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Control not found"
      );
    }
    
    let updatedControl = await this.ControlStatuses.findOneAndUpdateByOrg(
      this.connection.user.organizationId,
      { _id: id },
      { $set: updateData },
      { new: true }
    );

    this.complianceCache.clearAll();
    
    return this.ControlStatuses.populateControl(updatedControl);
  }
}
exports.ControlsManager = ControlsManager;