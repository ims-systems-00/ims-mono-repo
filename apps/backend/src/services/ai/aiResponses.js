const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { mainChannel } = require("../../eventsV2/topic");
class AIResponseCRUDOperations extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createAIResponse(data) {
    let { template, moduleType, module, createdBy } = data;
    let aiResponse = new this.AIResponses({
      template,
      source: {
        moduleType: moduleType,
        module: module || null,
      },
      created: {
        by: createdBy?._id,
        on: Date.now(),
      },
    });
    await aiResponse.save();
    aiResponse = await this.AIResponses.populateAiResponse(aiResponse);
    mainChannel.topic(SERVER_EVENTS.AI_ANALYSIS_CONDUCTED).emit({
      accessControl: this.connection,
      aiResponse,
    });
    // eventEmitter.emit(SERVER_EVENTS.AI_ANALYSIS_CONDUCTED, {
    //   accessControl: this.connection,
    //   aiResponse,
    // });
    return aiResponse;
  }
  async updateAIResponse(id, data) {
    let { template } = data;
    // let prevAIResponse = await this.getAIResponse({ _id: id });
    let aiResponse = await this.AIResponses.findOneAndUpdate(
      { _id: id },
      {
        $set: { template },
      },
      { new: true }
    );
    aiResponse = await this.AIResponses.populateAiResponse(aiResponse);
    return aiResponse;
  }
  async listAIResponses(query, options) {
    let pagination = await this.AIResponses.paginate(query, options);
    let aiResponses = pagination.docs;
    aiResponses = await Promise.all(
      aiResponses.map((aiResponse) =>
        this.AIResponses.populateAiResponse(aiResponse)
      )
    );
    return { aiResponses, pagination: this.imsPaginationFormated(pagination) };
  }
  async getAIResponse(query) {
    let aiResponse = await this.AIResponses.findOne(query);
    if (!aiResponse)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No aiResponse was found with the query."
      );
    return this.AIResponses.populateAiResponse(aiResponse);
  }
  async deleteAIResponse(id, data) {
    let aiResponse = await this.getAIResponse({ _id: id });
    await this.AIResponses.deleteOne({ _id: id });
    mainChannel.topic(SERVER_EVENTS.AI_ANALYSIS_DELETED).emit({
      accessControl: this.connection,
      aiResponse,
      user: data.user,
    });
    // eventEmitter.emit(SERVER_EVENTS.AI_ANALYSIS_DELETED, {
    //   accessControl: this.connection,
    //   aiResponse,
    //   user: data.user,
    // });
    return aiResponse;
  }
}
exports.AIResponseCRUDOperations = AIResponseCRUDOperations;
