/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Parsers/Params/IsoTimestamp
 */

/**
 * Parses a timestamp value and converts it to RFC3339/ISO8601 format if needed.
 * @function
 * @param   {Date|number|string} t
 * @returns {string}
 */
const isoTimestamp = (t) => {
  if (t instanceof Date) {
    return t.toISOString();
  }
  if (typeof t === 'number') {
    return new Date(t).toISOString();
  }
  return t;
};

export default isoTimestamp;
