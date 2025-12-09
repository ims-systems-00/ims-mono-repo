const { models } = require("../../../models");
const Trigger = require("../../triggers");
const dataOwnershipCheckListerns = require("../../../socket/listeners/dataOwnershipChecks.listener");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let organizationId = job.data?.accessControl?.user?.organizationId;
  let Hardware = models.hardwareassets(connection);
  let Risk = models.risks(connection);
  let Incident = models.incidents(connection);
  let Cip = models.cips(connection);
  let Supplier = models.suppliers(connection);
  let Customer = models.customers(connection);
  let Audit = models.audits(connection);
  let ManagementReview = models.managementreviews(connection);
  let DocumentRepository = models.documentrepositories(connection);
  let DocumentTree = models.documenttrees(connection);
  let Task = models.tasks(connection);
  let AIResponse = models.aiResponses(connection);

  function _flagForTransfer(message = "") {
    logger.info("Flagged data ownership", message);
    dataOwnershipCheckListerns({
      message:
        "You can transfer the ownership of the data to another user to ensure proper data integrity. Please click here to see a detailed breakdown of how the data in each module is handled.",
      canTransfer: true,
      user: job.data.initiator,
    });
  }
  try {
    const userToBeChecked = job.data.user._id;
    /**
     * check hardware owner
     */
    const hardware = await Hardware.findOneByOrg(organizationId, {
      owner: userToBeChecked,
    });
    if (hardware) return _flagForTransfer("Found hardware");
    /**
     * trasnfer risk owner
     */
    const risk = await Risk.findOneByOrg(organizationId, {
      owner: userToBeChecked,
    });
    if (risk) return _flagForTransfer("Found risk");
    /**
     * trasnfer incident owner
     */
    const incident = await Incident.findOneByOrg(organizationId, {
      owner: userToBeChecked,
    });
    if (incident) return _flagForTransfer("Found incident");
    /**
     * trasnfer ofi owner
     */
    const cip = await Cip.findOneByOrg(organizationId, {
      owner: userToBeChecked,
    });
    if (cip) return _flagForTransfer("Found cip");
    /**
     * trasnfer auditor
     */
    const audit = await Audit.findOneByOrg(organizationId, {
      auditor: userToBeChecked,
    });
    if (audit) return _flagForTransfer("Found audit");
    /**
     * remove from attendee list in management review
     */
    const managementReview = await ManagementReview.findOneByOrg(
      organizationId,
      {
        attendees: userToBeChecked,
      }
    );
    if (managementReview) return _flagForTransfer("Found management review");
    /**
     * trasnfer customer manager
     */
    const customer = await Customer.findOneByOrg(organizationId, {
      accountManager: userToBeChecked,
    });
    if (customer) return _flagForTransfer("Found customer");
    /**
     * trasnfer supplier buyer
     */
    const supplier = await Supplier.findOneByOrg(organizationId, {
      buyer: userToBeChecked,
    });
    if (supplier) return _flagForTransfer("Found supplier");
    /**
     * trasnfer repository owner
     */
    const repository = await DocumentRepository.findOneByOrg(organizationId, {
      owners: userToBeChecked,
    });
    if (repository) return _flagForTransfer("Found repository");
    /**
     * trasnfer document owner
     */
    const node = await DocumentTree.findOneByOrg(organizationId, {
      "documentData.owners": userToBeChecked,
    });
    if (node) return _flagForTransfer("Found node");
    /**
     * delete task owner
     */
    const task = await Task.findOneByOrg(organizationId, {
      "created.by": userToBeChecked,
    });
    if (task) return _flagForTransfer("Found task");
    /**
     * delete analysis owner
     */
    const aiResponse = await AIResponse.findOneByOrg(organizationId, {
      "created.by": userToBeChecked,
    });
    if (aiResponse) return _flagForTransfer("Found ai analysed response.");
    return dataOwnershipCheckListerns({
      message: "User has no data assigned to them.",
      canTransfer: false,
      user: job.data.initiator,
    });
  } catch (err) {
    logger.error(err.message, err);
  }
};
exports.completeAction = async (job) => {};
