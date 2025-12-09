const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { ImsForm } = require("./imsForm");
const mongoose = require("mongoose");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

const population = [
  {
    path: "submittedBy",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
  {
    path: "organization",
    select: "name logo",
  },
];
class ImsFormSubmission extends ImsForm {
  constructor(connection) {
    super(connection);
  }

  async createImsFormSubmission(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    await this.getImsForm({ _id: data.formId });

    const { formId, responses } = data;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      logger.info("Creating form submission...");

      let newFormSubmission = new this.ImsFormSubmission({
        formId: formId,
        submittedBy: this.connection.user._id,
        organization: this.connection.user.organizationId,
      });
      newFormSubmission = await newFormSubmission.save({ session });

      if (!newFormSubmission) {
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "Failed to create form submission."
        );
      }

      if (!responses || !Array.isArray(responses)) {
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "Responses must be an array."
        );
      }

      const formResponses = responses.map((response) => ({
        formId: formId,
        elementId: response.elementId,
        responseValue: response.responseValue,
        formSubmissionId: newFormSubmission._id,
        organization: this.connection.user.organizationId,
      }));
      logger.info("Inserting form responses...");

      await this.ImsFormResponse.insertMany(formResponses, { session });
      logger.info("Form responses inserted");
      newFormSubmission = await newFormSubmission.populate(population);
      await session.commitTransaction();
      return newFormSubmission;
    } catch (error) {
      logger.error("Transaction failed:", error);
      await session.abortTransaction();
      throw error;
    } finally {
      logger.info("Ending session");
      await session.endSession();
    }
  }
  async createImsFormSubmissionWithoutTran(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    await this.getImsForm({ _id: data.formId });

    const { formId, responses } = data;
    console.log("data is ", data);

    let newFormSubmission = new this.ImsFormSubmission({
      formId: formId,
      submittedBy: this.connection.user._id,
      organization: this.connection.user.organizationId,
    });
    newFormSubmission = await newFormSubmission.save();
    console.log(newFormSubmission);
    console.log("data", responses);
    if (!newFormSubmission) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Failed to create form submission."
      );
    }

    if (!responses || !Array.isArray(responses)) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Responses must be an array."
      );
    }

    const formResponses = responses.map((response) => ({
      ...response,
      formId: formId,
      formSubmissionId: newFormSubmission._id,
      organization: this.connection.user.organizationId,
    }));

    await this.ImsFormResponse.insertMany(formResponses);
    return newFormSubmission.populate(population);
  }

  async getImsFormSubmission(formId, submissionId) {
    formId = new mongoose.Types.ObjectId(formId);
    submissionId = new mongoose.Types.ObjectId(submissionId);
    const formSubmission = await this.ImsFormSubmission.findOne({
      _id: submissionId,
      formId: formId,
    });
    if (!formSubmission) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Form submission not found. "
      );
    }
    const aggregatePipeline = [
      [
        {
          $match: {
            _id: submissionId,
            formId: formId,
          },
        },
        {
          $lookup: {
            from: "imsformresponses",
            localField: "_id",
            foreignField: "formSubmissionId",
            as: "responses",
          },
        },
        {
          $unwind: "$responses",
        },
        {
          $lookup: {
            from: "imsformelements",
            localField: "responses.elementId",
            foreignField: "_id",
            as: "formElements",
          },
        },
        {
          $unwind: "$formElements",
        },
        {
          $match: {
            "formElements.previousFormElement": null,
          },
        },
        {
          $graphLookup: {
            from: "imsformelements",
            startWith: "$formElements._id",
            connectFromField: "nextFormElement",
            connectToField: "_id",
            as: "formSequence",
            depthField: "order",
          },
        },
        {
          $unwind: "$formSequence",
        },
        {
          $lookup: {
            from: "imsformresponses",
            let: {
              elementId: "$formSequence._id",
              submissionId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$elementId", "$$elementId"],
                      },
                      {
                        $eq: ["$formSubmissionId", "$$submissionId"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "responseValue",
          },
        },
        {
          $unwind: {
            path: "$responseValue",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "formSequence.order": 1,
          },
        },
        {
          $lookup: {
            from: "imsforms",
            localField: "formId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  title: 1,
                  description: 1,
                  themeForegroundColour: 1,
                  themeBackgroundColour: 1,
                  status: 1,
                },
              },
            ],
            as: "form",
          },
        },
        {
          $unwind: "$form",
        },
        {
          $lookup: {
            from: "users",
            localField: "submittedBy",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  profileImageSrc: 1,
                },
              },
            ],
            as: "submittedBy",
          },
        },
        {
          $unwind: "$submittedBy",
        },
        {
          $group: {
            _id: "$_id",
            form: {
              $first: "$form",
            },
            submittedBy: {
              $first: "$submittedBy",
            },
            responses: {
              $push: {
                elementId: "$formSequence._id",
                type: "$formSequence.type",
                attributes: "$formSequence.attributes",
                responseValue: "$responseValue.responseValue",
              },
            },
          },
        },
      ],
    ];

    const result = await this.ImsFormSubmission.aggregate(aggregatePipeline);
    if (!result.length) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No Result Found."
      );
    }

    return result[0];
  }

  async updateImsFormSubmission(id, data) {
    const { formId } = data;
    await this.getImsForm({ _id: formId });
    await this.getImsFormSubmission({ _id: id });
    let imsFormSubmission = await this.ImsFormSubmission.findOneAndUpdate(
      { _id: id },
      { $set: { ...data } },
      { new: true }
    );
    return imsFormSubmission.populate(population);
  }

  async listImsFormSubmission(query, options) {
    const pagination = await this.ImsFormSubmission.paginateByOrg(
      this.connection.user.organizationId,
      query,
      { ...options, populate: population }
    );

    return pagination;
  }

  async softRemoveImsFormSubmission(id) {
    const imsFormSubmission = this.getImsFormSubmission({ _id: id });
    if (imsFormSubmission) {
      await this.ImsFormSubmission.softDelete({ _id: id });
      return imsFormSubmission;
    }
  }

  async restoreImsFormSubmission(id) {
    const imsFormSubmission = await this.getImsFormSubmission({ _id: id });
    const session = await mongoose.startSession();
    if (imsFormSubmission) {
      await this.ImsFormSubmission.restore({ _id: id });
      return imsFormSubmission;
    }
  }

  async hardRemoveImsFormSubmission(id) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const formSubmission = await this.getImsFormSubmission(id);

      await this.ImsFormSubmission.deleteOne({ _id: id }, { session });
      await this.ImsFormResponse.deleteMany(
        { formSubmissionId: id },
        { session }
      );

      await session.commitTransaction();
      return formSubmission;
    } catch (error) {
      await session.abortTransaction();
      throw new APIError(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to delete form submission."
      );
    } finally {
      session.endSession();
    }
  }
}

module.exports = { ImsFormSubmission };
