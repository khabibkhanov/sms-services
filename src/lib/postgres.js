const { Pool } = require('pg');
const { pgConfig } = require('../config');
const { createLogger, transports } = require('winston');
require('winston-daily-rotate-file');

const pool = new Pool(pgConfig);

const fetch = async (sqlQuery, ...params) => {
  const client = await pool.connect();
  const logger = createLogger({
    transports: [
      new transports.DailyRotateFile({
        filename: 'logs/pg-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d'
      })
    ]
  });

  try {
    const { rows: [row] } = await client.query(sqlQuery, params.length ? params : null);
    logger.info(`Query: ${sqlQuery}, Params: ${JSON.stringify(params)}, Result: ${JSON.stringify(row)}`);
    return row;
  } catch (error) {
    logger.error(`Query: ${sqlQuery}, Params: ${JSON.stringify(params)}, Error: ${JSON.stringify(error)}`);
    return error;
  } finally {
    await client.release();
  }
};

const fetchAll = async (sqlQuery, ...params) => {
  const client = await pool.connect();
  const logger = createLogger({
    transports: [
      new transports.DailyRotateFile({
        filename: 'logs/pg-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d'
      })
    ]
  });

  try {
    const { rows } = await client.query(sqlQuery, params.length ? params : null);
    logger.info(`Query: ${sqlQuery}, Params: ${JSON.stringify(params)}, Result: ${JSON.stringify(rows)}`);
    return rows;
  } catch (error) {
    logger.error(`Query: ${sqlQuery}, Params: ${JSON.stringify(params)}, Error: ${JSON.stringify(error)}`);
    return error;
  } finally {
    await client.release();
  }
};

module.exports = { fetch, fetchAll };
