/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * Base64 module for cross-platform encoding.
 * @private
 * @module Encoding/Base64/React-Native
 */

import { Buffer } from 'buffer/';

export default {
  /**
   * Base64 encode a string value.
   * @param   {string} str
   * @returns {string}
   */
  encode: (str) => (
    Buffer.from(str).toString('base64')
  )
};
