/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Constants/Defaults
 */

import USER_AGENT from './user-agent.js';

/**
 * Sets the request timeout.
 * @const {number} timeout
 */
export const timeout = 30;

/**
 * Sets the number of seconds until an access token will expire once issued.
 * @const {number} expiresIn
 */
export const expiresIn = 604800;

/**
 * Sets the permissions of newly-issued access tokens.
 * @const {Array<string>} scope
 */
export const scope = ['predictions'];

/**
 * Sets the number of seconds of expected system clock skew.
 * @const {number} clockSkewOffset
 */
export const clockSkewOffset = 5 * 60;

/**
 * Sets the base URL for requests to the API server.
 * @const {string} baseUrl
 */
export const baseUrl = 'https://sunburst.sunsetwx.com/v1';

/**
 * Sets the user-agent HTTP header that is sent during requests to the API server.
 * @const {string} userAgent
 */
export const userAgent = USER_AGENT;
