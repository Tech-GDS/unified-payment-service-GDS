const { createLogger, format, transports } = require("winston");

const filename = "../unified-payment-service-GDA.log"; // log file name and location

const logger = createLogger({
  level: "info", // default log level can changed as per use (error, warn,debug) etc
  format: format.combine(
    // logger timestamp
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.status} ${info.timestamp} ${info.level}: ${info.message} - ${info.originalUrl} - ${info.method} - ${info.ip}`
    ) // defines format for logging
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          // prints logs in console
          (info) =>
            `${info.status} ${info.timestamp} ${info.level}: ${info.message} - ${info.originalUrl} - ${info.method} - ${info.ip}`
        )
      ),
    }),
    new transports.File({ filename }), // logs to files
  ],
});

module.exports = logger;
