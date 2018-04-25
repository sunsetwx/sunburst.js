/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Request/Node
 */

import { URL } from 'url';
import https from 'https';
import querystring from 'querystring';

/**
 * Sends a Node.js HTTP request.
 * @param   {string}  param.uri
 * @param   {string}  [param.method]
 * @param   {Object}  [param.headers]
 * @param   {Object}  [param.qs]
 * @param   {Object}  [param.formData]
 * @param   {Object}  [param.body]
 * @param   {number}  [param.timeout]
 * @returns {Promise}
 */
const request = ({ method = 'GET', uri, headers = {}, qs, formData, body, timeout }) => (
  new Promise((resolve, reject) => {
    try {
      if (body) {
        body = JSON.stringify(body);
        headers['content-length'] = Buffer.byteLength(body);
        headers['content-type'] = 'application/json; charset=utf-8';
      }
      if (formData) {
        body = querystring.stringify(formData);
        headers['content-length'] = Buffer.byteLength(body);
        headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      }
      if (qs) {
        uri = `${uri}?${querystring.stringify(qs)}`;
      }
    } catch (ex) {
      return reject(ex);
    }

    const options = {
      method,
      headers,
      // ecdhCurve must be set to auto: https://github.com/nodejs/node/issues/16196
      ecdhCurve: 'auto'
    };

    try {
      const parsedUrl = new URL(uri);

      options.protocol = parsedUrl.protocol;
      options.hostname = parsedUrl.hostname;
      options.port = parsedUrl.port;
      options.path = parsedUrl.pathname + parsedUrl.search;

    } catch (ex) {
      return reject(ex);
    }

    const respBuf = [];
    const req = https.request(options, (res) => {
      res.on('data', (d) => (
        respBuf.push(d)
      ));
      res.on('end', () => (
        resolve({
          response: Buffer.concat(respBuf).toString(),
          statusCode: res.statusCode
        })
      ));
    });

    req.on('error', (err) => {
      if (req.aborted) {
        return;
      }
      return reject(
        new Error(err.message || `unknown request error: ${uri}`)
      );
    });

    if (timeout > 0) {
      setTimeout(() => {
        req.abort();
        return reject(
          new Error(`request timeout: ${uri}`)
        );
      }, timeout * 1000);
    }

    if (typeof body === 'string') {
      req.write(body);
    }

    req.end();
  })
);

export default request;
