/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Parsers/Params/Quality
 */

import geo from '../types/geo.js';
import isoTimestamp from '../types/iso-timestamp';

/**
 * Parses input parameters for the GET method of the quality endpoint.
 * @param   {Object} params
 * @returns {Object}
 */
export const get = (params) => {
  params.geo = geo(params.geo);
  params.after = isoTimestamp(params.after);

  return params;
};

/**
 * Parses input parameters for the POST method of the quality endpoint.
 * @param   {Array.<Object>} paramsList
 * @returns {Array.<Object>}
 */
export const post = (paramsList) => (
  paramsList.map((params) => (
    get(params)
  ))
);
