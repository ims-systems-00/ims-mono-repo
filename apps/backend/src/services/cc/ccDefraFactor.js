const { Manager } = require("./manager");

class CcDefraFactor extends Manager {
  constructor(connection) {
    super(connection);
  }
  async listCcDefraFactor(query, options) {
    const pagination = await this.CcFactor.paginate(query, { ...options });
    return pagination;
  }
}

module.exports = { CcDefraFactor };
