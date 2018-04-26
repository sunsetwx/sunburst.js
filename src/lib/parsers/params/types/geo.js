/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Parsers/Params/Geo
 */

/**
 * Parses 'geo' values. Based on: https://tools.ietf.org/html/rfc5870.
 * @function
 * @param   {Array|Object|string} geo
 * @returns {string}
 */
const geo = (geo) => {
  if (Array.isArray(geo)) {
    return geo.join(',');
  }
  if (typeof geo === 'object') {
    return geo.coordinates.join(',');
  }
  return geo;
};

module.exports = geo;
