const mongoose = require('mongoose');

const statusController = (schema) => {
  schema.add({
    status: {
      type: String,
      default: 'pending'
    }
  });

  const manageStatus = function() {
    if (this.implementedAt) {
      this.status = 'implemented';
    } else {
      this.status = 'pending';
    }
  }

  // Middleware to set status based on implementedAt and createdAt before saving
  schema.pre('save', manageStatus);

  schema.pre('findOneAndUpdate',manageStatus);


};

module.exports = { statusController };
