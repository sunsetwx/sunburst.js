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

/**
 * Sets the request timeout.
 * @const {number} TIMEOUT
 */
export const TIMEOUT = 30;

/**
 * Sets the number of seconds until an access token will expire once issued.
 * @const {number} EXPIRES_IN
 */
export const EXPIRES_IN = 604800;

/**
 * Sets the permissions of newly-issued access tokens.
 * @const {Array<string>} SCOPE
 */
export const SCOPE = ['predictions'];

/**
 * Sets the number of seconds of expected system clock skew.
 * @const {number} CLOCK_SKEW_OFFSET
 */
export const CLOCK_SKEW_OFFSET = 5 * 60;

/**
 * Sets the base URL for requests to the API server.
 * @const {string} BASE_URL
 */
export const BASE_URL = 'https://sunburst.sunsetwx.com/v1';
