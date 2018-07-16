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
   * @param {string} message An error message or error code
   * @param {string} error An error message or error code
   * @param {string} [error_description] A human-readable error message
   * @param {number} [statusCode] An HTTP status code
   */
  constructor(resp, statusCode) {
    super();
    this.message = resp.error;
    if (resp.error_description) {
      this.message = resp.error_description;
    }
    this.name = 'RequestError';
    this.statusCode = statusCode;
    this.error = resp.error;
    this.error_description = resp.error_description;
  }
}

module.exports = RequestError;
