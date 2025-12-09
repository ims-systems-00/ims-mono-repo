const { Manager } = require("./manager");
const moment = require("moment");
const {
  USER_TYPE,
  GROUP_TYPE,
  IMS_POLICIES,
} = require("@ims-systems-00/ims-core/lib/constants");
const mongoose = require("mongoose");

class GlobalStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async globalStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    const totalStaffResult = await this.Membership.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(organizationId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "invitedUserId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.type": USER_TYPE.INTERNAL,
          "user.systemAccess.status": { $ne: "Deactivated" },
        },
      },
      {
        $count: "count",
      },
    ]);

    const totalStaff = totalStaffResult[0]?.count || 0;

    // remote staff

    const remoteStaffResult = await this.Membership.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(organizationId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "invitedUserId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.type": USER_TYPE.INTERNAL,
          "user.systemAccess.status": { $ne: "Deactivated" },
          "user.workLocationType": "Remote",
        },
      },
      {
        $count: "count",
      },
    ]);

    const remoteStaff = remoteStaffResult[0]?.count || 0;

    // Get compliance bodies count
    const complianceBodies = await this.Group.countDocuments({
      organization: organizationId,
      type: { $in: [GROUP_TYPE.INTERNAL_CU, GROUP_TYPE.EXTERNAL_CU] },
    });

    const businessUnits = await this.Group.countDocuments({
      organization: organizationId,
      type: { $in: [GROUP_TYPE.INTERNAL_BU, GROUP_TYPE.EXTERNAL_U] },
    });

    // Calculate organizational confidence
    let points = 0;

    // Check assets
    const hardwareAssets = await this.HardwareAsset.find({
      organization: organizationId,
    });
    const softwareAssets = await this.SoftwareAsset.find({
      organization: organizationId,
    });
    const peopleAssets = await this.PeopleAsset.find({
      organization: organizationId,
    });
    const premiseAssets = await this.PremiseAsset.find({
      organization: organizationId,
    });
    const informationAssets = await this.InformationAsset.find({
      organization: organizationId,
    });

    if (
      hardwareAssets.length +
      softwareAssets.length +
      peopleAssets.length +
      premiseAssets.length +
      informationAssets.length
    )
      points++;

    // Check risks
    const risks = await this.Risk.find({
      organization: organizationId,
      ...dateFilter,
    });
    if (risks.length) points++;

    // Check audits
    const audits = await this.Audit.find({
      organization: organizationId,
      ...dateFilter,
    });
    if (audits.length) points++;

    // Check completed audits
    const completedAudits = await this.Audit.find({
      organization: organizationId,
      ...dateFilter,
      "completed.status": true,
    });
    if (completedAudits.length) points++;

    // Check management reviews
    const managementReviews = await this.ManagementReview.find({
      organization: organizationId,
      ...dateFilter,
      "completed.status": true,
    });
    if (managementReviews.length) points++;

    const organizationalConfidence = Math.round((100 * points) / 5);

    // Calculate organizational state using aggregation
    const riskStats = await this.Risk.aggregate([
      {
        $match: {
          organization: organizationId,
          ...dateFilter,
        },
      },
      {
        $facet: {
          totalRisks: [{ $count: "count" }],
          mitigatedRisks: [
            {
              $match: {
                "mitigated.status": true,
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const totalRisks = riskStats[0].totalRisks[0]?.count || 0;
    const mitigatedRisks = riskStats[0].mitigatedRisks[0]?.count || 0;
    const mitigationPercentage = totalRisks
      ? Math.round((100 * mitigatedRisks) / totalRisks)
      : 0;

    let organizationalState = "Safe";
    if (totalRisks > 0) {
      if (mitigationPercentage > 80) {
        organizationalState = "Safe";
      } else if (mitigationPercentage > 60) {
        organizationalState = "Secure";
      } else if (mitigationPercentage > 40) {
        organizationalState = "Unsecure";
      } else if (mitigationPercentage > 20) {
        organizationalState = "Vulnerable";
      } else {
        organizationalState = "Hazardous";
      }
    }

    // Calculate critical area using optimized aggregation
    const criticalAreaStats = await this.Risk.aggregate([
      {
        $match: {
          organization: organizationId,
          ...dateFilter,
          type: {
            $in: [
              "Hardware",
              "Software",
              "People",
              "Premises",
              "Organisation",
              "Clinical",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const criticalArea =
      criticalAreaStats.length > 0
        ? criticalAreaStats[0]._id
        : "No Critical Area";

    // Calculate incident resolution times using optimized aggregation
    const incidentResolutionTimes = await this.calculateAverageResolutionTime(
      organizationId,
      dateFilter.createdAt.$gte,
      dateFilter.createdAt.$lte
    );

    return {
      organizationalConfidence,
      businessUnit: businessUnits,
      numberOfStaffs: totalStaff,
      numberOfStaffsRemote: remoteStaff,
      complianceBodies: complianceBodies,
      criticalArea,
      organizationalState,
      incidentResolutionTimes,
      accurateAs: new Date(),
    };
  }

  msToTime(duration) {
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return {
      hours: hours, // Return as number for comparison
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds,
      milliseconds,
    };
  }

  async calculateAverageResolutionTime(organizationId, startDate, endDate) {
    const organization = await this.Organization.findById(organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const resolutionStats = await this.Incident.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(organizationId),
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          "resolved.status": true,
          "resolved.on": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$priority",
          totalTime: {
            $sum: {
              $subtract: ["$resolved.on", "$createdAt"],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          priority: "$_id",
          averageTime: {
            $divide: ["$totalTime", "$count"],
          },
          count: 1,
        },
      },
    ]);

    const statsMap = resolutionStats.reduce((acc, stat) => {
      acc[stat.priority] = {
        time: this.msToTime(stat.averageTime),
        count: stat.count,
      };
      return acc;
    }, {});

    const expectedTimes = {
      P1: organization.p1incidentResolutionTime || 24,
      P2: organization.p2incidentResolutionTime || 48,
      P3: organization.p3incidentResolutionTime || 72,
      P4: organization.p4incidentResolutionTime || 96,
    };

    console.log("statsMap", statsMap);
    console.log("expectedTimes", expectedTimes);
    return {
      p1: {
        time: statsMap.P1
          ? `${statsMap.P1.time.hours}hr : ${statsMap.P1.time.minutes}min`
          : "0hr : 0min",
        alert: statsMap.P1 ? statsMap.P1.time.hours >= expectedTimes.P1 : false,
        count: statsMap.P1?.count || 0,
      },
      p2: {
        time: statsMap.P2
          ? `${statsMap.P2.time.hours}hr : ${statsMap.P2.time.minutes}min`
          : "0hr : 0min",
        alert: statsMap.P2 ? statsMap.P2.time.hours >= expectedTimes.P2 : false,
        count: statsMap.P2?.count || 0,
      },
      p3: {
        time: statsMap.P3
          ? `${statsMap.P3.time.hours}hr : ${statsMap.P3.time.minutes}min`
          : "0hr : 0min",
        alert: statsMap.P3 ? statsMap.P3.time.hours >= expectedTimes.P3 : false,
        count: statsMap.P3?.count || 0,
      },
      p4: {
        time: statsMap.P4
          ? `${statsMap.P4.time.hours}hr : ${statsMap.P4.time.minutes}min`
          : "0hr : 0min",
        alert: statsMap.P4 ? statsMap.P4.time.hours >= expectedTimes.P4 : false,
        count: statsMap.P4?.count || 0,
      },
    };
  }
}

module.exports = { GlobalStatsService };
