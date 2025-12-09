const { models } = require("../../../models");
const Trigger = require("../../triggers");
const dataTransferListerns = require("../../../socket/listeners/dataTransfer.listener");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const mongoose = require("mongoose");
const { mainChannel } = require("../../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../../eventsV2/topicsName");

exports.consume = async (job) => {
  dataTransferListerns({
    message: "Data transfer started",
    transferProcessRunning: true,
    user: job.data.initiator,
  });
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

  async function _performAutoPaginatedQuery(cb) {
    logger.info("Initiating data transfer.");
    const pageSize = 100;
    let pageNumber = 0;
    while (true) {
      try {
        let result = await cb(pageNumber, pageSize);
        logger.info("Results and page number:", {
          result: result,
          pageNumber: pageNumber,
        });
        if (result.modifiedCount === 0 || result.modifiedCount === 0) {
          break;
        }
      } catch (err) {
        logger.info("", { errorMessage: err.message, errors: err });
        break;
      }
      pageNumber++;
    }
  }

  try {
    const sourceUser = job.data.sourceUser._id;
    const destinationUser = job.data.destinationUser._id;
    /**
     * trasnfer hardware owner
     */
    logger.info("Source user and destination user:", {
      sourceUser: sourceUser,
      destinationUser: destinationUser,
    });
    const transferHardware = (pageNumber, pageSize) =>
      Hardware.updateManyByOrg(
        organizationId,
        {
          owner: sourceUser,
        },
        {
          $set: { owner: destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferHardware);
    /**
     * trasnfer risk owner
     */
    const transferRisk = (pageNumber, pageSize) =>
      Risk.updateManyByOrg(
        organizationId,
        {
          owner: sourceUser,
        },
        {
          $set: { owner: destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferRisk);
    /**
     * trasnfer incident owner
     */
    const transferIncident = (pageNumber, pageSize) =>
      Incident.updateManyByOrg(
        organizationId,
        {
          owner: sourceUser,
        },
        {
          $set: { owner: destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferIncident);
    /**
     * trasnfer ofi owner
     */
    const transferCip = (pageNumber, pageSize) =>
      Cip.updateManyByOrg(
        organizationId,
        {
          owner: sourceUser,
        },
        {
          $set: { owner: destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferCip);
    /**
     * trasnfer auditor
     */
    const transferAudit = (pageNumber, pageSize) =>
      Audit.updateManyByOrg(
        organizationId,
        {
          auditor: sourceUser,
        },
        {
          $set: { auditor: destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferAudit);
    /**
     * remove from attendee list in management review
     */
    const removeFromAttendees = (pageNumber, pageSize) =>
      ManagementReview.updateManyByOrg(
        organizationId,
        {
          attendees: sourceUser,
        },
        {
          $pull: { attendees: sourceUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(removeFromAttendees);
    /**
     * trasnfer customer manager
     */
    const transferCustomer = (pageNumber, pageSize) =>
      Customer.updateManyByOrg(
        organizationId,
        {
          accountManager: sourceUser,
        },
        {
          $set: { accountManager: destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferCustomer);
    /**
     * trasnfer supplier buyer
     */
    const transferSupplier = (pageNumber, pageSize) =>
      Supplier.updateManyByOrg(
        organizationId,
        {
          buyer: sourceUser,
        },
        {
          $set: { buyer: destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferSupplier);
    /**
     * trasnfer document owner
     */
    const transferDocumenttreeNodeOwners = (pageNumber, pageSize) =>
      DocumentTree.updateManyByOrg(
        organizationId,
        {
          "documentData.owners": sourceUser,
        },
        {
          $set: {
            "documentData.owners.$": destinationUser,
          },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferDocumenttreeNodeOwners);
    /**
     * trasnfer document owner
     */
    const transferRepositoryOwners = (pageNumber, pageSize) =>
      DocumentRepository.updateManyByOrg(
        organizationId,
        {
          owners: sourceUser,
        },
        {
          $set: {
            "owners.$": destinationUser,
          },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferRepositoryOwners);
    /**
     * transfer task owner
     */
    const transferTasks = (pageNumber, pageSize) =>
      Task.updateManyByOrg(
        organizationId,
        {
          "created.by": sourceUser,
        },
        {
          $set: { "created.by": destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferTasks);
    /**
     * delete ai analysed response owner
     */
    const transferAIResponses = (pageNumber, pageSize) =>
      AIResponse.updateManyByOrg(
        organizationId,
        {
          "created.by": sourceUser,
        },
        {
          $set: { "created.by": destinationUser },
        }
      )
        .skip(pageNumber * pageSize)
        .limit(pageSize);
    _performAutoPaginatedQuery(transferAIResponses);
  } catch (err) {
    logger.info(err);
  }
};
exports.completeAction = async (job) => {
  let connection = job.data?.accessControl;
  try {
    const trigger = new Trigger(connection);
    dataTransferListerns({
      message: "Data transfer end",
      transferProcessRunning: false,
      user: job.data.initiator,
    });
    mainChannel
      .topic(SERVER_EVENTS_BUS.REFERETIAL_INTEGRITY_HANDLE_COMPLETE_EVENT)
      .emit({
        accessControl: connection,
        initiator: job.data.initiator,
        sourceUser: job.data.sourceUser,
        destinationUser: job.data.destinationUser,
      });
    // trigger.sendNotification(
    //   "referentialIntegrityHandleCompleteEvent",
    //   {
    //     initiator: job.data.initiator,
    //     sourceUser: job.data.sourceUser,
    //     destinationUser: job.data.destinationUser,
    //   },
    //   {
    //     email: true,
    //   }
    // );
    mainChannel.topic(SERVER_EVENTS_BUS.DATA_OWNERSHIP_TRANSFERED_EVENT).emit({
      accessControl: connection,
      initiator: job.data.initiator,
      sourceUser: job.data.sourceUser,
      destinationUser: job.data.destinationUser,
    });
    // trigger.sendNotification(
    //   "dataOwnershipTransferedEvent",
    //   {
    //     initiator: job.data.initiator,
    //     sourceUser: job.data.sourceUser,
    //     destinationUser: job.data.destinationUser,
    //   },
    //   {
    //     email: true,
    //   }
    // );
  } catch (err) {
    logger.info(err);
  }
};
