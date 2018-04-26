/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

const { name, version } = require('../../../package.json');

const userAgent = [];

if (typeof navigator !== 'undefined' && navigator.userAgent) {
  userAgent.push(navigator.userAgent);
}

if (typeof process !== 'undefined' && process.versions) {
  userAgent.push(Object.keys(process.versions).map((key) => (
    `${key}/${process.versions[key]}`
  )).join(' '));
}

userAgent.push(`${name}/${version}`);

const USER_AGENT = userAgent.join(' ');

/**
 * Sets the user-agent HTTP header that is sent during requests to the API server.
 * @const {string} USER_AGENT
 */
module.exports = USER_AGENT;
