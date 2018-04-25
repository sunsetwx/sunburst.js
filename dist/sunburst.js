/* sunburst.js v1.0.0 | (c) SunsetWx, LLC. and other contributors | ISC License */
'use strict';

var url = require('url');
var https = require('https');
var querystring = require('querystring');

var name = "sunburst.js";
var version = "1.0.0";

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

const userAgent = [];

if (typeof navigator !== 'undefined' && navigator.userAgent) {
  userAgent.push(navigator.userAgent);
}

if (typeof process !== 'undefined' && process.versions) {
  userAgent.push(Object.keys(process.versions).map(key => `${key}/${process.versions[key]}`).join(' '));
}

userAgent.push(`${name}/${version}`);

var USER_AGENT = userAgent.join(' ');

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * Sets the request timeout.
 * @const {number} timeout
 */
const timeout = 30;

/**
 * Sets the number of seconds until an access token will expire once issued.
 * @const {number} expiresIn
 */
const expiresIn = 604800;

/**
 * Sets the permissions of newly-issued access tokens.
 * @const {Array<string>} scope
 */
const scope = ['predictions'];

/**
 * Sets the number of seconds of expected system clock skew.
 * @const {number} clockSkewOffset
 */
const clockSkewOffset = 5 * 60;

/**
 * Sets the base URL for requests to the API server.
 * @const {string} baseUrl
 */
const baseUrl = 'https://sunburst.sunsetwx.com/v1';

/**
 * Sets the user-agent HTTP header that is sent during requests to the API server.
 * @const {string} userAgent
 */
const userAgent$1 = USER_AGENT;

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * An error containing a message and HTTP status code.
 * @class
 */
class RequestError extends Error {
  /**
   * Creates an instance of RequestError.
   * @param {string} message An error message
   * @param {number} [statusCode] An HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.name = 'RequestError';
    this.statusCode = statusCode;
  }
}

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
 * @module Encoding/Base64/Node
 */
var Base64 = {
  /**
   * Base64 encode a string value.
   * @param   {string} str
   * @returns {string}
   */
  encode: str => Buffer.from(str).toString('base64')
};

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * Case-conversion module.
 * @private
 * @module Encoding/Case
 */
var Case = {
  /**
   * snakeToCamel converts a snake-case string to camel-case.
   * @param   {string} str
   * @returns {string}
   */
  snakeToCamel(str) {
    return str.replace(/_[a-zA-Z]/g, strSlice => strSlice.toUpperCase().replace('_', ''));
  },

  /**
   * camelToSnake converts a camel-case string to snake-case.
   * @param   {string} str
   * @returns {string}
   */
  camelToSnake(str) {
    return str.replace(/[A-Z]/g, strSlice => `_${strSlice.toLowerCase()}`);
  },

  /**
   * convertCaseKeys is a higher-order function that converts a value's keys or child's keys using the given function.
   * @param   {*}        obj
   * @param   {function} convertCaseFn
   * @returns {*}
   */
  convertCaseKeys(obj, convertCaseFn) {
    if (Array.isArray(obj)) {
      const caseArr = [];

      for (let i = 0; i < obj.length; i++) {
        if (obj[i] !== null && (Array.isArray(obj[i]) || typeof obj[i] === 'object')) {
          caseArr[i] = this.convertCaseKeys(obj[i], convertCaseFn);
        } else {
          caseArr[i] = obj[i];
        }
      }

      return caseArr;
    }

    if (obj && typeof obj === 'object') {
      const caseObj = {};

      Object.keys(obj).forEach(key => {
        const camelKey = convertCaseFn(key);

        if (obj[key] !== null && typeof obj[key] === 'object') {
          caseObj[camelKey] = this.convertCaseKeys(obj[key], convertCaseFn);
        } else {
          caseObj[camelKey] = obj[key];
        }
      });

      return caseObj;
    }

    return obj;
  }
};

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

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
const request = ({ method = 'GET', uri, headers = {}, qs, formData, body, timeout }) => new Promise((resolve, reject) => {
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
    const parsedUrl = new url.URL(uri);

    options.protocol = parsedUrl.protocol;
    options.hostname = parsedUrl.hostname;
    options.port = parsedUrl.port;
    options.path = parsedUrl.pathname + parsedUrl.search;
  } catch (ex) {
    return reject(ex);
  }

  const respBuf = [];
  const req = https.request(options, res => {
    res.on('data', d => respBuf.push(d));
    res.on('end', () => resolve({
      response: Buffer.concat(respBuf).toString(),
      statusCode: res.statusCode
    }));
  });

  req.on('error', err => {
    if (req.aborted) {
      return;
    }
    return reject(new Error(err.message || `unknown request error: ${uri}`));
  });

  if (timeout > 0) {
    setTimeout(() => {
      req.abort();
      return reject(new Error(`request timeout: ${uri}`));
    }, timeout * 1000);
  }

  if (typeof body === 'string') {
    req.write(body);
  }

  req.end();
});

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
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
const geo = geo => {
  if (Array.isArray(geo)) {
    return geo.join(',');
  }
  if (typeof geo === 'object') {
    return geo.coordinates.join(',');
  }
  return geo;
};

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
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
const isoTimestamp = t => {
  if (t instanceof Date) {
    return t.toISOString();
  }
  if (typeof t === 'number') {
    return new Date(t).toISOString();
  }
  return t;
};

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * Parses input parameters for the GET method of the quality endpoint.
 * @param   {Object} params
 * @returns {Object}
 */
const get = params => {
  params.geo = geo(params.geo);
  params.after = isoTimestamp(params.after);

  return params;
};

/**
 * Parses input parameters for the POST method of the quality endpoint.
 * @param   {Array.<Object>} paramsList
 * @returns {Array.<Object>}
 */
const post = paramsList => paramsList.map(params => get(params));

var quality = /*#__PURE__*/Object.freeze({
  get: get,
  post: post
});

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * Parses input parameters for the GET method of the location endpoint.
 * @function
 * @param   {Object} params
 * @returns {Object}
 */
const get$1 = params => {
  params.geo = geo(params.geo);
  return params;
};

var location = /*#__PURE__*/Object.freeze({
  get: get$1
});

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

var params = {
  quality,
  location
};

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */
var parsers = { params };

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

/**
 * Exposes methods and stores settings used for accessing Sunburst API endpoints.
 */
class SunburstAPI {
  /**
   * Creates a new instance of SunburstAPI.
   * 
   * @param {Object} [options]
   * An object containing API client settings. This object may be empty when
   * only using the `createSession` method.
   * 
   * @param {string} options.clientId
   * The `clientId` returned by `createSession` that is required for obtaining
   * an access token. This is also used for deleting, signing-out, or otherwise
   * invalidating the session pair. This field is equivalent to the `id` field
   * returned by `sessions` and used as input to `deleteSession`.
   * 
   * @param {string} options.clientSecret
   * The `clientSecret` returned by `createSession` that is required for
   * obtaining an access token.
   * 
   * @param {number} [options.expiresIn]
   * The number of seconds until access tokens will expire.
   * Currently: `900` (15 minutes) to `604800` (1 week). Default: `604800`.
   * 
   * @param {Array<string>} [options.scope]
   * A list of permissions that specifies the types of actions that access tokens
   * will be able to perform with the API.
   * 
   * @param {Array<string>} [options.origins]
   * A list of origins corresponding with the `origin` HTTP header,
   * matching the base URLs of websites that access tokens may be used with.
   * This value can be a glob-style pattern.
   * Up to four patterns are permitted per token.
   * 
   * @param {Array<string>} [options.addresses]
   * A list of IP addresses and CIDR ranges from where access tokens may be used
   * to make requests.
   * Up to four addresses and CIDR networks are permitted per token.
   * 
   * @param {string} [options.baseUrl]
   * The base URL that the API client will use to make requests.
   * This is used internally for testing and setting it is not recommended.
   * 
   * @param {string} [options.userAgent]
   * A string containing software and library versions sent with each request
   * to help the SunsetWx team determine which platforms and platform versions
   * deserve the most attention during periods of improvement.
   * Only change this if you know what you are doing or would like to prevent
   * sending us this info.
   * 
   * @param {number} [options.timeout]
   * The number of seconds afterward that a request should be canceled,
   * if the request does not succeed,
   * from the moment that the API client sends the request.
   * 
   * @param {number} [options.clockSkewOffset]
   * The number of seconds of expected system clock skew.
   * This value is used to set the amount of time before access token expiration
   * that tokens should be refreshed.
   */
  constructor(options) {
    const defaultOptions = {
      clientId: '',
      clientSecret: '',
      expiresIn: expiresIn,
      scope: scope,
      origins: [],
      addresses: [],
      baseUrl: baseUrl,
      userAgent: userAgent$1,
      timeout: timeout,
      clockSkewOffset: clockSkewOffset
    };
    this._options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Sends API HTTP requests.
   * Avoid using this method unless you know what you are doing.
   * No support will be provided that relates to an issue resulting from a
   * direct use of this method.
   * 
   * @param {Object} params
   * @param {string} params.path
   * Path used relative to the base URL.
   * 
   * @param {string} [params.method]
   * HTTP method to be sent during the request.
   * 
   * @param {Object} [params.headers]
   * HTTP headers to be sent during the request.
   * When an `authorization` header is omitted, an access token will be used,
   * requesting a new access token if the existing token has expired.
   * 
   * @param {Object} [params.qs]
   * Querystring parameters to be encoded and then added to the path.
   * 
   * @param {Object} [params.formData]
   * Form data to be encoded and then written to the request body.
   * 
   * @param {Object} [params.body]
   * Request body data to be JSON-encoded and then written to the request body.
   * 
   * @param {Object} [parent]
   * Used during a reauth attempt to contain the original Promise callback references.
   * This should almost always not be set.
   * 
   * @param {Function} [parent.resolve]
   * A Promise resolve callback.
   * 
   * @param {Function} [parent.reject]
   * A Promise reject callback.
   * 
   * @returns {Promise<Object|Array<Object>>}
   */
  request(params = {}, parent) {
    var _this = this;

    const { path, method = 'GET', headers = {}, qs, formData, body } = params;

    return new Promise((() => {
      var _ref = asyncToGenerator(function* (resolve, reject) {
        try {
          // Use the existing Promise value's callbacks when attempting to reauth.
          // The new Promise value will be discarded.
          if (parent) {
            resolve = parent.resolve;
            reject = parent.reject;
          }

          const defaultHeaders = {
            'user-agent': _this._options.userAgent
          };

          // Skip adding an access token if the header is already present.
          if (!headers.authorization) {
            const { accessToken } = yield _this.getToken({
              forceRefresh: parent
            });

            defaultHeaders.authorization = `Bearer ${accessToken}`;
          }

          const encodedResp = yield request({
            method,
            uri: `${_this._options.baseUrl}${path}`,
            headers: Object.assign({}, defaultHeaders, headers),
            qs: Case.convertCaseKeys(qs, Case.camelToSnake),
            formData: Case.convertCaseKeys(formData, Case.camelToSnake),
            body: Case.convertCaseKeys(body, Case.camelToSnake),
            timeout: _this._options.timeout
          });

          const resp = JSON.parse(encodedResp.response);
          if (resp.error) {
            if (encodedResp.statusCode === 401 && !parent) {
              return _this.request(params, { resolve, reject });
            }
            return reject(new RequestError(resp.error, encodedResp.statusCode));
          }

          return resolve(Case.convertCaseKeys(resp, Case.snakeToCamel));
        } catch (ex) {
          try {
            if (typeof ex.statusCode !== 'number') {
              return reject(ex);
            }

            const { error } = JSON.parse(ex.message);
            return reject(new RequestError(error || ex.message, ex.statusCode));
          } catch (internalEx) {
            // internalEx is discarded to preserve the original message.
            return reject(ex);
          }
        }
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    })());
  }

  /**
   * Creates a session `clientId` and `clientSecret` to use for obtaining an
   * access token. A session is equivalent to OAuth 2.0 `client_credentials`.
   * 
   * @param {Object} params
   * @param {string} params.email
   * An email address associated with an account.
   * 
   * @param {string} params.password
   * A valid password for the account with the given email.
   * 
   * @param {string} [params.passcode]
   * A temporary passcode that is required when multi-factor authentication
   * has been enabled.
   * 
   * @param {Array<string>} [params.scope]
   * A list of access token scopes that access tokens can be created with using
   * the new session credentials.
   * 
   * @param {string} [params.type]
   * The type of session credentials to create. Default: `permanent`.
   * 
   * @param {Object} [params.params]
   * Additional parameters to send as encoded form data written to the request body.
   * This is used internally and there is no need to set this.
   * 
   * @returns {Promise<Object>}
   */
  createSession({ email, password, passcode, scope: scope$$1, type = 'permanent', params = {} }) {
    var _this2 = this;

    return new Promise((() => {
      var _ref2 = asyncToGenerator(function* (resolve, reject) {
        try {
          const defaultParams = {
            'grant_type': 'password',
            'scope': scope$$1.join(' '),
            type,
            passcode
          };

          const credentials = `${email}:${password}`;
          const encodedCredentials = Base64.encode(credentials);

          const { session } = yield _this2.request({
            method: 'POST',
            path: '/login',
            headers: {
              authorization: `Basic ${encodedCredentials}`
            },
            formData: Object.assign({}, defaultParams, params)
          });

          session.scope = session.scope.split(' ');
          return resolve(session);
        } catch (ex) {
          return reject(ex);
        }
      });

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    })());
  }

  /**
   * Uses a session `clientId` and `clientSecret` to obtain an access token
   * for to making API requests. This method is called automatically during requests.
   * 
   * @param {Object} [params]
   * @param {boolean} [forceRefresh]
   * Refresh the current access token even though it may not have expired.
   * 
   * @returns {Promise<Object>}
   */
  getToken({ forceRefresh = false }) {
    var _this3 = this;

    return new Promise((() => {
      var _ref3 = asyncToGenerator(function* (resolve, reject) {

        if (!forceRefresh) {
          if (_this3.token && typeof _this3.token === 'object') {
            const skewedExpiration = _this3.token.expires - _this3._options.clockSkewOffset * 1000;

            if (skewedExpiration - new Date().valueOf() > 0) {
              return resolve({ accessToken: _this3.token.accessToken });
            }
          }
        }

        try {
          if (!_this3._options.clientId || !_this3._options.clientSecret) {
            throw new Error('create a new instance of SunburstAPI with both clientId and clientSecret options set');
          }

          const credentials = `${_this3._options.clientId}:${_this3._options.clientSecret}`;
          const encodedCredentials = Base64.encode(credentials);

          const { accessToken, expiresIn: expiresIn$$1 } = yield _this3.request({
            method: 'POST',
            path: '/login/session',
            headers: {
              authorization: `Basic ${encodedCredentials}`
            },
            formData: {
              'grant_type': 'client_credentials',
              'expires_in': _this3._options.expiresIn,
              'scope': _this3._options.scope.join(' '),
              'origins': _this3._options.origins.join(' '),
              'addresses': _this3._options.addresses.join(' ')
            }
          });

          _this3.token = {
            accessToken,
            expires: expiresIn$$1 * 1000 + new Date().valueOf()
          };

          return resolve({ accessToken });
        } catch (ex) {
          return reject(ex);
        }
      });

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    })());
  }

  /**
   * Attempts to logout the current access token.
   * @returns {Promise<Object>}
   */
  logout() {
    var _this4 = this;

    return new Promise((() => {
      var _ref4 = asyncToGenerator(function* (resolve, reject) {
        try {
          const resp = yield _this4.request({
            method: 'POST',
            path: '/logout'
          });

          _this4.token = null;
          return resolve(resp);
        } catch (ex) {
          return reject(ex);
        }
      });

      return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
      };
    })());
  }

  /**
   * Returns a list of session metadata.
   * @param {Object} [params]
   * @param {string} [params.type]
   * Filters out sessions with types that do not match this value.
   * 
   * @returns {Promise<Array<Object>>}
   */
  sessions(params = {}) {
    return this.request({
      path: '/account/sessions',
      qs: params
    });
  }

  /**
   * Deletes a session using its ID.
   * @param {Object} params
   * @param {string} params.id
   * The session ID or `clientId` to delete.
   * 
   * @returns {Promise<Object>}
   */
  deleteSessionById(params = { id: '' }) {
    return this.request({
      method: 'DELETE',
      path: `/account/session/${params.id}`,
      formData: params
    });
  }

  /**
   * Deletes all sessions, filtering by type.
   * @param {Object} [params]
   * @param {string} [params.type]
   * Filters out sessions with types that do not match this value.
   * 
   * @returns {Promise<Object>}
   */
  deleteSessions(params = {}) {
    return this.request({
      method: 'DELETE',
      path: '/account/sessions',
      formData: params
    });
  }

  /**
   * Returns current account information and rate limit status.
   * @returns {Promise<Object>}
   */
  account() {
    return this.request({
      path: '/account'
    });
  }

  /**
   * Deletes the account.
   * @param {Object} params
   * @param {string} params.password
   * A valid password for the account with the given email.
   * 
   * @returns {Promise<Object>}
   */
  deleteAccount(params = {}) {
    return this.request({
      method: 'DELETE',
      path: '/account',
      formData: params
    });
  }

  /**
   * Submits a password reset request using a registered email address.
   * @param {Object} params
   * @param {string} params.email
   * An email address associated with an account.
   * 
   * @returns {Promise<Object>}
   */
  passwordReset(params = {}) {
    return this.request({
      method: 'POST',
      path: '/account/password/reset',
      formData: params
    });
  }

  /**
   * Submits a request to change a registered email address.
   * @param {Object} params
   * @param {string} params.email
   * An email address associated with an account.
   * 
   * @param {string} params.password
   * A valid password for the account with the given email.
   * 
   * @returns {Promise<Object>}
   */
  updateEmail(params = {}) {
    return this.request({
      method: 'POST',
      path: '/account/email',
      formData: params
    });
  }

  /**
   * Updates multi-factor authentication settings.
   * @param {Object} params
   * @param {string} params.password
   * A valid password for the account with the given email.
   * 
   * @param {string} [params.secret]
   * A secret code generated by the `mfaTotpSecret` method.
   * This must be entered into a supported multi-factor authentication client,
   * such as Google Authenticator, and a passcode entered to confirm.
   * 
   * @param {number} [params.passcode]
   * A temporary passcode from a supported multi-factor authentication client,
   * such as Google Authenticator, used to confirm the new secret code.
   * 
   * @param {boolean} [params.enabled]
   * Sets whether multi-factor authentication is enabled, which requires a passcode
   * to be entered with an email address and password during each login.
   * 
   * @param {boolean} [params.newRecoveryCodes]
   * Sets whether to regenerate a new list of recovery codes that can be used
   * instead of a passcode when the registered multi-factor authentication client
   * is not available.
   * 
   * @returns {Promise<Object>}
   */
  updateMfa(params = {}) {
    return this.request({
      method: 'POST',
      path: '/account/mfa',
      formData: params
    });
  }

  /**
   * Generates a new secret code for input into a multi-factor authentication
   * client that supports TOTP, such as Google Authenticator.
   * 
   * @returns {Promise<Object>}
   */
  totpSecret() {
    return this.request({
      path: '/account/mfa/totp'
    });
  }

  /**
   * Returns current multi-factor authentication settings.
   * @returns {Promise<Object>}
   */
  mfa() {
    return this.request({
      path: '/account/mfa'
    });
  }

  /**
   * Returns coordinates based on a location query.
   * @param {Object} params
   * @param {string} params.location
   * The name of a location, that is often a combination of a city, region,
   * and country.
   * 
   * @returns {Promise<Object>}
   */
  coordinates(params = {}) {
    return this.request({
      path: '/coordinates',
      qs: params
    });
  }

  /**
   * Returns a location based on coordinates.
   * @param {Object} params
   * @param {Array|Object|string} params.geo
   * A valid RFC5870-formatted geo URI, excluding its scheme which is `geo`.
   * This can also be an array of latitude and longitude coordinates.
   * 
   * @returns {Promise<Object>}
   */
  location(params = {}) {
    return this.request({
      path: '/location',
      qs: parsers.params.location.get(params)
    });
  }

  /**
   * Returns a sunrise or sunset quality prediction query result.
   * @param {Object} params
   * @param {Array|Object|string} params.geo
   * A valid RFC5870-formatted geo URI, excluding its scheme which is `geo`.
   * This can also be an array of latitude and longitude coordinates.
   * 
   * @param {string} [params.type]
   * Forecast prediction type. Currently, ether `sunrise` or `sunset`.
   * 
   * @param {string} [params.after]
   * A timestamp value that the events in the result should occur after.
   * This is used to view forecasts up to several days into the future.
   * 
   * @param {string} [params.sort]
   * Sets the property to sort by and the order of the returned results.
   * View https://sunburst.sunsetwx.com/v1/docs/#get-quality for a complete list.
   * 
   * @param {number} [params.limit]
   * A number that limits the amount of returned results.
   * 
   * @param {string} [params.source]
   * Sets the model source for the query. Currently, ether `NAM` or `GFS`.
   * 
   * @param {number} [params.radius]
   * A number that limits the amount of returned results by the given distance
   * in kilometers.
   * 
   * @returns {Promise<Object>}
   */
  quality(params = {}) {
    return this.request({
      path: '/quality',
      qs: parsers.params.quality.get(params)
    });
  }

  /**
   * Returns multiple sunrise or sunset quality prediction query results.
   * 
   * It is up to the caller to check for error fields within returned array items,
   * as not every query may have failed, making an exception throw inappropriate
   * for this situation.
   * 
   * @param {Array<Object>} paramsList
   * A list of quality prediction query parameters.
   * View the parameters of the `quality` method for a complete parameter list.
   * 
   * @returns {Promise<Array<Object>>}
   */
  batchQuality(paramsList = []) {
    return this.request({
      method: 'POST',
      path: '/quality',
      body: parsers.params.quality.post(paramsList)
    });
  }
}

/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

module.exports = SunburstAPI;
