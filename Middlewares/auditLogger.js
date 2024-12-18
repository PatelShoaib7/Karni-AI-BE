const { auditLog } = require("../Models/audit-logsModel");


const auditLogger = async (req, res, next,) => {
  const originalSend = res.send;

  // Override res.send to capture the response body
  console.log("--req,ip--",req.ip)
 
      await auditLog.create({
        ip: req.ip,
        route: req.originalUrl,
        method: req.method,
        requestBody: req.body,
        responseStatus: (res.statusCode || res.responseStatus),
        responseBody :( req.body || res.responseBody)
        })

  next();
};

module.exports = auditLogger;
