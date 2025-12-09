const deleteMarkerSchema = {
  deleteMarker: {
    status: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    dateScheduled: {
      type: Date,
      default: null,
    },
  },
};
exports.deleteMarkerSchema = deleteMarkerSchema;
