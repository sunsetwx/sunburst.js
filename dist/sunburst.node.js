/* sunburst.js v2.1.3 | (c) SunsetWx, LLC. and other contributors | ISC License */
"use strict";

var url = require("url");

var https = require("https");

var querystring = require("querystring");

const defaults = {
    TIMEOUT: 30,
    EXPIRES_IN: 604800,
    SCOPE: [ "predictions" ],
    CLOCK_SKEW_OFFSET: 5 * 60,
    BASE_URL: "https://sunburst.sunsetwx.com/v1"
};

var defaults_1 = defaults;

const userAgent = [];

if (typeof navigator !== "undefined" && navigator.userAgent) {
    userAgent.push(navigator.userAgent);
}

if (typeof process !== "undefined" && process.versions) {
    userAgent.push(Object.keys(process.versions).map(key => `${key}/${process.versions[key]}`).join(" "));
}

userAgent.push(`sunburst.js/2.1.3`);

const USER_AGENT = userAgent.join(" ");

var userAgent_1 = USER_AGENT;

class RequestError extends Error {
    constructor(resp, statusCode) {
        super();
        this.message = resp.error;
        if (resp.error_description) {
            this.message = resp.error_description;
        }
        this.name = "RequestError";
        this.statusCode = statusCode;
        this.error = resp.error;
        this.error_description = resp.error_description;
    }
}

var requestError = RequestError;

const Base64 = {
    encode: str => Buffer.from(str).toString("base64")
};

var node = Base64;

const Case = {
    snakeToCamel(str) {
        return str.replace(/_[a-zA-Z]/g, strSlice => strSlice.toUpperCase().replace("_", ""));
    },
    camelToSnake(str) {
        return str.replace(/[A-Z]/g, strSlice => `_${strSlice.toLowerCase()}`);
    },
    convertCaseKeys(obj, convertCaseFn) {
        if (Array.isArray(obj)) {
            const caseArr = [];
            for (let i = 0; i < obj.length; i++) {
                if (obj[i] !== null && (Array.isArray(obj[i]) || typeof obj[i] === "object")) {
                    caseArr[i] = this.convertCaseKeys(obj[i], convertCaseFn);
                } else {
                    caseArr[i] = obj[i];
                }
            }
            return caseArr;
        }
        if (obj && typeof obj === "object") {
            const caseObj = {};
            Object.keys(obj).forEach(key => {
                const camelKey = convertCaseFn(key);
                if (obj[key] !== null && typeof obj[key] === "object") {
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

var _case = Case;

const {URL: URL} = url;

const semverStrToArr = str => str.split(".").map(intStr => parseInt(intStr, 10));

const request = ({method: method = "GET", uri: uri, headers: headers = {}, qs: qs, formData: formData, body: body, timeout: timeout}) => new Promise((resolve, reject) => {
    try {
        if (body) {
            body = JSON.stringify(body);
            headers["content-length"] = Buffer.byteLength(body);
            headers["content-type"] = "application/json; charset=utf-8";
        }
        if (formData) {
            body = querystring.stringify(formData);
            headers["content-length"] = Buffer.byteLength(body);
            headers["content-type"] = "application/x-www-form-urlencoded; charset=utf-8";
        }
        if (qs) {
            uri = `${uri}?${querystring.stringify(qs)}`;
        }
    } catch (ex) {
        return reject(ex);
    }
    const options = {
        method: method,
        headers: headers
    };
    const [nodeMajVer, nodeMinVer] = semverStrToArr(process.versions.node);
    if (nodeMajVer < 10) {
        if (nodeMajVer === 9 || nodeMajVer === 8 && nodeMinVer >= 6) {
            options.ecdhCurve = "auto";
        }
    }
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
    const req = https.request(options, res => {
        res.on("data", d => respBuf.push(d));
        res.on("end", () => resolve({
            response: Buffer.concat(respBuf).toString(),
            statusCode: res.statusCode
        }));
    });
    req.on("error", err => {
        if (req.aborted) {
            return;
        }
        return reject(new Error(err.message || `unknown request error: ${uri}`));
    });
    if (timeout > 0) {
        setTimeout(() => {
            req.abort();
            return reject(new Error(`request timeout: ${uri}`));
        }, timeout * 1e3);
    }
    if (typeof body === "string") {
        req.write(body);
    }
    req.end();
});

var node$1 = request;

const geo = geo => {
    if (Array.isArray(geo)) {
        return geo.join(",");
    }
    if (typeof geo === "object") {
        return geo.coordinates.join(",");
    }
    if (typeof geo === "string") {
        return geo.replace(/\s+/g, "");
    }
    return geo;
};

var geo_1 = geo;

const isoTimestamp = t => {
    if (t instanceof Date) {
        return t.toISOString();
    }
    if (typeof t === "number") {
        return new Date(t).toISOString();
    }
    return t;
};

var isoTimestamp_1 = isoTimestamp;

const get = params => {
    params.geo = geo_1(params.geo);
    params.after = isoTimestamp_1(params.after);
    return params;
};

const post = paramsList => paramsList.map(params => get(params));

var quality = {
    get: get,
    post: post
};

var params = {
    quality: quality
};

var parsers = {
    params: params
};

var asyncToGenerator = function(fn) {
    return function() {
        var gen = fn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
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
                    return Promise.resolve(value).then(function(value) {
                        step("next", value);
                    }, function(err) {
                        step("throw", err);
                    });
                }
            }
            return step("next");
        });
    };
};

class SunburstJS {
    constructor(options) {
        const defaultOptions = {
            clientId: "",
            clientSecret: "",
            expiresIn: defaults_1.EXPIRES_IN,
            scope: defaults_1.SCOPE,
            origins: [],
            addresses: [],
            token: null,
            timeout: defaults_1.TIMEOUT,
            clockSkewOffset: defaults_1.CLOCK_SKEW_OFFSET,
            userAgent: userAgent_1,
            baseUrl: defaults_1.BASE_URL
        };
        this._state = Object.assign({}, defaultOptions, options);
    }
    request(params = {}, parent) {
        var _this = this;
        const {path: path, method: method = "GET", headers: headers = {}, qs: qs, formData: formData, body: body} = params;
        return new Promise((() => {
            var _ref = asyncToGenerator(function*(resolve, reject) {
                try {
                    if (parent) {
                        resolve = parent.resolve;
                        reject = parent.reject;
                    }
                    const defaultHeaders = {
                        "user-agent": _this._state.userAgent
                    };
                    if (!headers.authorization) {
                        const {accessToken: accessToken} = yield _this.getToken({
                            forceRefresh: parent
                        });
                        defaultHeaders.authorization = `Bearer ${accessToken}`;
                    }
                    const encodedResp = yield node$1({
                        method: method,
                        uri: `${_this._state.baseUrl}${path}`,
                        headers: Object.assign({}, defaultHeaders, headers),
                        qs: _case.convertCaseKeys(qs, _case.camelToSnake),
                        formData: _case.convertCaseKeys(formData, _case.camelToSnake),
                        body: _case.convertCaseKeys(body, _case.camelToSnake),
                        timeout: _this._state.timeout
                    });
                    const resp = JSON.parse(encodedResp.response);
                    if (resp.error) {
                        if (encodedResp.statusCode === 401 && !parent) {
                            return _this.request(params, {
                                resolve: resolve,
                                reject: reject
                            });
                        }
                        return reject(new requestError(resp, encodedResp.statusCode));
                    }
                    return resolve(_case.convertCaseKeys(resp, _case.snakeToCamel));
                } catch (ex) {
                    try {
                        if (typeof ex.statusCode !== "number") {
                            return reject(ex);
                        }
                        const resp = JSON.parse(ex.message);
                        return reject(new requestError(resp || {
                            error: ex.message
                        }, ex.statusCode));
                    } catch (internalEx) {
                        return reject(ex);
                    }
                }
            });
            return function(_x, _x2) {
                return _ref.apply(this, arguments);
            };
        })());
    }
    createSession({email: email, password: password, passcode: passcode, scope: scope = defaults_1.SCOPE, type: type = "permanent", params: params = {}}) {
        var _this2 = this;
        return new Promise((() => {
            var _ref2 = asyncToGenerator(function*(resolve, reject) {
                try {
                    const defaultParams = {
                        grant_type: "password",
                        scope: scope.join(" "),
                        type: type,
                        passcode: passcode
                    };
                    const credentials = `${email}:${password}`;
                    const encodedCredentials = node.encode(credentials);
                    const {session: session} = yield _this2.request({
                        method: "POST",
                        path: "/login",
                        headers: {
                            authorization: `Basic ${encodedCredentials}`
                        },
                        formData: Object.assign({}, defaultParams, params)
                    });
                    session.scope = session.scope.split(" ");
                    return resolve(session);
                } catch (ex) {
                    return reject(ex);
                }
            });
            return function(_x3, _x4) {
                return _ref2.apply(this, arguments);
            };
        })());
    }
    getToken({forceRefresh: forceRefresh, preventStore: preventStore}) {
        var _this3 = this;
        return new Promise((() => {
            var _ref3 = asyncToGenerator(function*(resolve, reject) {
                if (!forceRefresh) {
                    if (_this3._state.token && typeof _this3._state.token === "object") {
                        const {token: token, clockSkewOffset: clockSkewOffset} = _this3._state;
                        const {accessToken: accessToken, expires: expires} = token;
                        const skewedExpiration = expires - clockSkewOffset * 1e3;
                        if (skewedExpiration - new Date().valueOf() > 0) {
                            return resolve({
                                accessToken: accessToken,
                                expires: expires
                            });
                        }
                    }
                }
                try {
                    if (!_this3._state.clientId || !_this3._state.clientSecret) {
                        throw new Error("create a new instance of SunburstJS with both clientId and clientSecret options set");
                    }
                    const credentials = `${_this3._state.clientId}:${_this3._state.clientSecret}`;
                    const encodedCredentials = node.encode(credentials);
                    const {accessToken: accessToken, expiresIn: expiresIn} = yield _this3.request({
                        method: "POST",
                        path: "/login/session",
                        headers: {
                            authorization: `Basic ${encodedCredentials}`
                        },
                        formData: {
                            grant_type: "client_credentials",
                            expires_in: _this3._state.expiresIn,
                            scope: _this3._state.scope.join(" "),
                            origins: _this3._state.origins.join(" "),
                            addresses: _this3._state.addresses.join(" ")
                        }
                    });
                    const expires = expiresIn * 1e3 + new Date().valueOf();
                    if (!preventStore) {
                        _this3._state.token = {
                            accessToken: accessToken,
                            expires: expires
                        };
                    }
                    return resolve({
                        accessToken: accessToken,
                        expires: expires
                    });
                } catch (ex) {
                    return reject(ex);
                }
            });
            return function(_x5, _x6) {
                return _ref3.apply(this, arguments);
            };
        })());
    }
    logout() {
        var _this4 = this;
        return new Promise((() => {
            var _ref4 = asyncToGenerator(function*(resolve, reject) {
                try {
                    const resp = yield _this4.request({
                        method: "POST",
                        path: "/logout"
                    });
                    _this4._state.token = null;
                    return resolve(resp);
                } catch (ex) {
                    return reject(ex);
                }
            });
            return function(_x7, _x8) {
                return _ref4.apply(this, arguments);
            };
        })());
    }
    sessions(params = {}) {
        return this.request({
            path: "/account/sessions",
            qs: params
        });
    }
    deleteSessionById(params = {
        id: ""
    }) {
        return this.request({
            method: "DELETE",
            path: `/account/session/${params.id}`,
            formData: params
        });
    }
    deleteSessions(params = {}) {
        return this.request({
            method: "DELETE",
            path: "/account/sessions",
            formData: params
        });
    }
    account() {
        return this.request({
            path: "/account"
        });
    }
    deleteAccount(params = {}) {
        return this.request({
            method: "DELETE",
            path: "/account",
            formData: params
        });
    }
    passwordReset(params = {}) {
        return this.request({
            method: "POST",
            path: "/account/password/reset",
            formData: params
        });
    }
    updateEmail(params = {}) {
        return this.request({
            method: "POST",
            path: "/account/email",
            formData: params
        });
    }
    updateMfa(params = {}) {
        return this.request({
            method: "POST",
            path: "/account/mfa",
            formData: params
        });
    }
    mfa() {
        return this.request({
            path: "/account/mfa"
        });
    }
    quality(params = {}) {
        return this.request({
            path: "/quality",
            qs: parsers.params.quality.get(params)
        });
    }
    batchQuality(paramsList = []) {
        return this.request({
            method: "POST",
            path: "/quality",
            body: parsers.params.quality.post(paramsList)
        });
    }
}

var sunburst = SunburstJS;

var src = sunburst;

module.exports = src;
