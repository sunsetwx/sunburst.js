/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Parsers/Params/Location
 */

import geo from '../types/geo.js';

/**
 * Parses input parameters for the GET method of the location endpoint.
 * @function
 * @param   {Object} params
 * @returns {Object}
 */
export const get = (params) => {
  params.geo = geo(params.geo);
  return params;
};
