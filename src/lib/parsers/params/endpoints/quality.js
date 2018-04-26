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

const geo = require('../types/geo.js');
const isoTimestamp = require('../types/iso-timestamp');

/**
 * Parses input parameters for the GET method of the quality endpoint.
 * @param   {Object} params
 * @returns {Object}
 */
const get = (params) => {
  params.geo = geo(params.geo);
  params.after = isoTimestamp(params.after);

  return params;
};

/**
 * Parses input parameters for the POST method of the quality endpoint.
 * @param   {Array.<Object>} paramsList
 * @returns {Array.<Object>}
 */
const post = (paramsList) => (
  paramsList.map((params) => (
    get(params)
  ))
);

module.exports = {
  get,
  post
};
