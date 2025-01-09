import { NextFunction, Request, Response } from 'express';
import * as log4jui from './log4jui';
import { propsExist } from './objectUtilities';

const logger = log4jui.getLogger('errorHandler');

/**
 * Note that the next, NextFunction is required here.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err, req: Request, res: Response, next: NextFunction) {
  if (propsExist(err, ['config', 'headers'])) {
    // remove any sensitive data, such as bearer token from being logged
    delete err.config.headers;
  }
  if (propsExist(err, ['request', '_header'])) {
    // remove any sensitive data
    delete err.request._header;
  }
  if (err?.data) {
    logger._logger.error(err.data);
  } else {
    if (err) {
      logger._logger.error(err.toString());
    } else {
      logger._logger.error('errorHanndler called with no error');
    }
  }
  const errorStatus = err.status ? err.status : 500;
  const errorContent = err.data ? err.data : { message: 'Internal Server Error' };
  res.status(errorStatus).send(errorContent);
}
