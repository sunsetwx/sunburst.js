/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Constants/Defaults
 */

const defaults = {
  /**
   * Sets the request timeout.
   * @const {number} TIMEOUT
   */
  TIMEOUT: 30,

  /**
   * Sets the number of seconds until an access token will expire once issued.
   * @const {number} EXPIRES_IN
   */
  EXPIRES_IN: 604800,

  /**
   * Sets the permissions of newly-issued access tokens.
   * @const {Array<string>} SCOPE
   */
  SCOPE: ['predictions'],

  /**
   * Sets the number of seconds of expected system clock skew.
   * @const {number} CLOCK_SKEW_OFFSET
   */
  CLOCK_SKEW_OFFSET: 5 * 60,

  /**
   * Sets the base URL for requests to the API server.
   * @const {string} BASE_URL
   */
  BASE_URL: 'https://sunburst.sunsetwx.com/v1'
}

module.exports = defaults;
