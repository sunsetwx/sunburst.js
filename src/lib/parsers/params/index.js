/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

import * as quality from './endpoints/quality.js';
import * as location from './endpoints/location.js';

export default {
  quality,
  location
};
