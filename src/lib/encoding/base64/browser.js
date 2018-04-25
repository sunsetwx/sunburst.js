/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * Base64 module for cross-platform encoding.
 * @private
 * @module Encoding/Base64/Browser
 */
export default {
  /**
   * Base64 encode a string value.
   * @param   {string} str
   * @returns {string}
   */
  encode: (str) => (
    btoa(str)
  )
};
