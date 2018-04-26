/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

const quality = require('./endpoints/quality.js');
const location = require('./endpoints/location.js');

module.exports = {
  quality,
  location
};
