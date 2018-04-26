/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * @private
 * @module Request/Browser
 */

/**
 * Percent-encodes an object into a URL-safe string.
 * @param   {Object} data
 * @returns {string}
 */
const serialize = (data) => (
  Object.keys(data).map((key) => (
    // Fix for react-native's serialization of undefined properties.
    (typeof data[key] !== 'undefined') ? (
      encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    ) : (
      null
    )
  )).join('&')
);

/**
 * Sends an in-browser HTTP request.
 * @param   {string} param.uri
 * @param   {string} [param.method]
 * @param   {Object} [param.headers]
 * @param   {Object} [param.qs]
 * @param   {Object} [param.formData]
 * @param   {Object} [param.body]
 * @param   {number} [param.timeout]
 * @returns {Promise}
 */
const request = ({ uri, method = 'GET', headers = {}, qs, formData, body, timeout }) => (
  new Promise((resolve, reject) => {
    try {
      if (body) {
        body = JSON.stringify(body);
        headers['content-type'] = 'application/json; charset=utf-8';
      }
      if (formData) {
        body = serialize(formData);
        headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      }    
      if (qs) {
        uri = `${uri}?${serialize(qs)}`;
      }
    } catch (ex) {
      return reject(ex);
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, uri);

    Object.keys(headers).forEach((header) => (
      xhr.setRequestHeader(header, headers[header])
    ));

    xhr.onerror = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 0) {
          return;
        }
      }
      return reject(
        new Error(xhr.statusText || `unknown request error: ${uri}`)
      );
    };

    xhr.onabort = () => (
      reject(
        new Error(`request timeout: ${uri}`)
      )
    );

    xhr.onload = () => (
      resolve({
        response: xhr.response,
        statusCode: xhr.status
      })
    );

    if (timeout > 0) {
      setTimeout(() => (
        xhr.abort()
      ), timeout * 1000);
    }

    xhr.send(body);
  })
);

export default request;
