/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * An error containing a message and HTTP status code.
 * @class
 */
class RequestError extends Error {
  /**
   * Creates an instance of RequestError.
   * @param {string} message An error message
   * @param {number} [statusCode] An HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.name = 'RequestError';
    this.statusCode = statusCode;
  }
}

export default RequestError;
