
const winston = require('winston'),
    CloudWatchTransport = require('winston-aws-cloudwatch');
require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV || 'development';

let logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,
    })
  ]
});

const config = {
  logGroupName: 'backend-server',
  logStreamName: NODE_ENV,
  createLogGroup: false,
  createLogStream: true,
  awsConfig: {
    accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
    region: process.env.CLOUDWATCH_REGION
  },
  formatLog: (item) => {
    return item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta)
  }
}

if (NODE_ENV != 'development') logger.add(CloudWatchTransport, config);

logger.level = process.env.LOG_LEVEL || "silly";

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  }
};

console.log(`env variable region = ${process.env.CLOUDWATCH_REGION}`)

module.exports = logger;
