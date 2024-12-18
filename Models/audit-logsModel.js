const mongoose = require("mongoose");

// Define the audit log schema
const auditLogSchema = new mongoose.Schema(
  {
    ip: { type : mongoose.Schema.Types.Mixed, required: false },
    route: { type : mongoose.Schema.Types.Mixed , required: false }, 
    method: { type : mongoose.Schema.Types.Mixed , required: false }, 
    requestBody: { type: Object, required: false }, 
    responseStatus: { type: Number, required: false },
    responseBody: { type: Object, required: false },
    responseBody: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }, 
  },
  { timestamps: true, strict: true }
);

const auditLog = mongoose.model("auditLog", auditLogSchema); // Model name convention is usually singular


module.exports = {
  auditLog, 
};
