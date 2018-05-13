/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

const defaults = require('./constants/defaults.js');
const USER_AGENT = require('./constants/user-agent.js');
const RequestError = require('./errors/request-error.js');
const Base64 = require('./encoding/base64/node.js');
const Case = require('./encoding/case.js');
const request = require('./request/node.js');
const parsers = require('./parsers/index.js');

/**
 * Exposes methods and stores settings used for accessing Sunburst API endpoints.
 */
class SunburstJS {
  /**
   * Creates a new instance of SunburstJS.
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
   * @param {Object} [options.token]
   * An object containing an `accessToken` string and an `expires` unix
   * timestamp in milliseconds,
   * equivalent to a value returned by the `getToken` method.
   * This is used to manually set an access token and expiration when the state
   * of those values is stored outside of an instance of this class,
   * such as when using redux.
   * 
   * @param {string} options.token.accessToken
   * A string representing an access token.
   * Required if its container object, `token`, is present within the `options` object.
   * 
   * @param {number} options.token.expires
   * A number representing the access token's expiration time as a unix
   * timestamp in milliseconds. Required if its container object, `token`,
   * is present within the `options` object.
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
   * 
   * @param {string} [options.userAgent]
   * A string containing software and library versions sent with each request
   * to help the SunsetWx team determine which platforms and platform versions
   * deserve the most attention during periods of improvement.
   * Only change this if you know what you are doing or would like to prevent
   * sending us this info.
   * 
   * @param {string} [options.baseUrl]
   * The base URL that the API client will use to make requests.
   * This is used internally for testing and setting it is not recommended.
   */
  constructor(options) {
    const defaultOptions = {
      clientId: '',
      clientSecret: '',
      expiresIn: defaults.EXPIRES_IN,
      scope: defaults.SCOPE,
      origins: [],
      addresses: [],
      token: null,
      timeout: defaults.TIMEOUT,
      clockSkewOffset: defaults.CLOCK_SKEW_OFFSET,
      userAgent: USER_AGENT,
      baseUrl: defaults.BASE_URL,
    };
    this._state = Object.assign({}, defaultOptions, options);
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
    const { path, method = 'GET', headers = {}, qs, formData, body } = params;

    return new Promise(async (resolve, reject) => {
      try {
        // Use the existing Promise value's callbacks when attempting to reauth.
        // The new Promise value will be discarded.
        if (parent) {
          resolve = parent.resolve;
          reject = parent.reject;
        }

        const defaultHeaders = {
          'user-agent': this._state.userAgent
        };

        // Skip adding an access token if the header is already present.
        if (!headers.authorization) {
          const { accessToken } = await this.getToken({
            forceRefresh: (parent)
          });

          defaultHeaders.authorization = `Bearer ${accessToken}`;
        }

        const encodedResp = await request({
          method,
          uri:      `${this._state.baseUrl}${path}`,
          headers:  Object.assign({}, defaultHeaders, headers),
          qs:       Case.convertCaseKeys(qs, Case.camelToSnake),
          formData: Case.convertCaseKeys(formData, Case.camelToSnake),
          body:     Case.convertCaseKeys(body, Case.camelToSnake),
          timeout:  this._state.timeout
        });

        const resp = JSON.parse(encodedResp.response);
        if (resp.error) {
          if (encodedResp.statusCode === 401 && !parent) {
            return this.request(params, { resolve, reject });
          }
          return reject(
            new RequestError(resp.error, encodedResp.statusCode)
          );
        }

        return resolve(
          Case.convertCaseKeys(resp, Case.snakeToCamel)
        );

      } catch (ex) {
        try {
          if (typeof ex.statusCode !== 'number') {
            return reject(ex);
          }

          const { error } = JSON.parse(ex.message);
          return reject(
            new RequestError(error || ex.message, ex.statusCode)
          );

        } catch (internalEx) {
          // internalEx is discarded to preserve the original message.
          return reject(ex);
        }
      }
    })
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
  createSession({ email, password, passcode, scope = defaults.SCOPE, type = 'permanent', params = {} }) {
    return new Promise(async (resolve, reject) => {
      try {
        const defaultParams = {
          'grant_type': 'password',
          'scope': scope.join(' '),
          type,
          passcode
        };

        const credentials = `${email}:${password}`;
        const encodedCredentials = Base64.encode(credentials);

        const { session } = await this.request({
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
  }

  /**
   * Uses a session `clientId` and `clientSecret` to obtain an access token
   * for to making API requests. This method is called automatically during requests.
   * 
   * @param {Object} [params]
   * @param {boolean} [forceRefresh]
   * Refresh the current access token even though it may not have expired.
   * 
   * @param {boolean} [preventStore]
   * Prevent storing new access token data within the class instance.
   * 
   * @returns {Promise<Object>}
   */
  getToken({ forceRefresh, preventStore }) {
    return new Promise(async (resolve, reject) => {

      if (!forceRefresh) {
        if (this._state.token && typeof this._state.token === 'object') {
          const { token, clockSkewOffset } = this._state;
          const { accessToken, expires } = token;

          const skewedExpiration = expires - (clockSkewOffset * 1000);

          if (skewedExpiration - new Date().valueOf() > 0) {
            return resolve({ accessToken, expires });
          }
        }
      }

      try {
        if (!this._state.clientId || !this._state.clientSecret) {
          throw new Error('create a new instance of SunburstJS with both clientId and clientSecret options set');
        }

        const credentials = `${this._state.clientId}:${this._state.clientSecret}`;
        const encodedCredentials = Base64.encode(credentials);

        const { accessToken, expiresIn } = await this.request({
          method: 'POST',
          path: '/login/session',
          headers: {
            authorization: `Basic ${encodedCredentials}`
          },
          formData: {
            'grant_type': 'client_credentials',
            'expires_in': this._state.expiresIn,
            'scope': this._state.scope.join(' '),
            'origins': this._state.origins.join(' '),
            'addresses': this._state.addresses.join(' ')
          }
        });

        const expires = expiresIn * 1000 + new Date().valueOf();

        if (!preventStore) {
          this._state.token = { accessToken, expires };
        }

        return resolve({ accessToken, expires });

      } catch (ex) {
        return reject(ex);
      }
    });
  }

  /**
   * Attempts to logout the current access token.
   * @returns {Promise<Object>}
   */
  logout() {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.request({
          method: 'POST',
          path: '/logout'
        });

        this._state.token = null;
        return resolve(resp);

      } catch (ex) {
        return reject(ex);
      }
    });
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
   * A new email address to be associated with the account.
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
   * such as Google Authenticator,
   * and a passcode from the device entered to confirm the new `secret` code.
   * 
   * @param {number} [params.passcode]
   * A temporary passcode from a supported multi-factor authentication client,
   * such as Google Authenticator, used to confirm the new `secret` code.
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

module.exports = SunburstJS;
