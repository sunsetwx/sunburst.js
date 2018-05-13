/* sunburst.js v1.2.3 | (c) SunsetWx, LLC. and other contributors | ISC License */
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

var defaults$1 = Object.freeze({
    default: defaults_1,
    __moduleExports: defaults_1
});

const userAgent = [];

if (typeof navigator !== "undefined" && navigator.userAgent) {
    userAgent.push(navigator.userAgent);
}

if (typeof process !== "undefined" && process.versions) {
    userAgent.push(Object.keys(process.versions).map(key => `${key}/${process.versions[key]}`).join(" "));
}

userAgent.push(`sunburst.js/1.2.3`);

const USER_AGENT = userAgent.join(" ");

var userAgent_1 = USER_AGENT;

var userAgent$1 = Object.freeze({
    default: userAgent_1,
    __moduleExports: userAgent_1
});

class RequestError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "RequestError";
        this.statusCode = statusCode;
    }
}

var requestError = RequestError;

var requestError$1 = Object.freeze({
    default: requestError,
    __moduleExports: requestError
});

const Base64 = {
    encode: str => Buffer.from(str).toString("base64")
};

var node = Base64;

var node$1 = Object.freeze({
    default: node,
    __moduleExports: node
});

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

var _case$1 = Object.freeze({
    default: _case,
    __moduleExports: _case
});

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

var node$2 = request;

var node$3 = Object.freeze({
    default: node$2,
    __moduleExports: node$2
});

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

var geo$1 = Object.freeze({
    default: geo_1,
    __moduleExports: geo_1
});

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

var isoTimestamp$1 = Object.freeze({
    default: isoTimestamp_1,
    __moduleExports: isoTimestamp_1
});

var geo$2 = geo$1 && geo_1 || geo$1;

var isoTimestamp$2 = isoTimestamp$1 && isoTimestamp_1 || isoTimestamp$1;

const get = params => {
    params.geo = geo$2(params.geo);
    params.after = isoTimestamp$2(params.after);
    return params;
};

const post = paramsList => paramsList.map(params => get(params));

var quality = {
    get: get,
    post: post
};

var quality_1 = quality.get;

var quality_2 = quality.post;

var quality$1 = Object.freeze({
    default: quality,
    __moduleExports: quality,
    get: quality_1,
    post: quality_2
});

const get$1 = params => {
    params.geo = geo$2(params.geo);
    return params;
};

var location = {
    get: get$1
};

var location_1 = location.get;

var location$1 = Object.freeze({
    default: location,
    __moduleExports: location,
    get: location_1
});

var quality$2 = quality$1 && quality || quality$1;

var location$2 = location$1 && location || location$1;

var params = {
    quality: quality$2,
    location: location$2
};

var params_1 = params.quality;

var params_2 = params.location;

var params$1 = Object.freeze({
    default: params,
    __moduleExports: params,
    quality: params_1,
    location: params_2
});

var params$2 = params$1 && params || params$1;

var parsers = {
    params: params$2
};

var parsers_1 = parsers.params;

var parsers$1 = Object.freeze({
    default: parsers,
    __moduleExports: parsers,
    params: parsers_1
});

var defaults$2 = defaults$1 && defaults_1 || defaults$1;

var USER_AGENT$1 = userAgent$1 && userAgent_1 || userAgent$1;

var RequestError$1 = requestError$1 && requestError || requestError$1;

var Base64$1 = node$1 && node || node$1;

var Case$1 = _case$1 && _case || _case$1;

var request$1 = node$3 && node$2 || node$3;

var parsers$2 = parsers$1 && parsers || parsers$1;

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
            expiresIn: defaults$2.EXPIRES_IN,
            scope: defaults$2.SCOPE,
            origins: [],
            addresses: [],
            token: null,
            timeout: defaults$2.TIMEOUT,
            clockSkewOffset: defaults$2.CLOCK_SKEW_OFFSET,
            userAgent: USER_AGENT$1,
            baseUrl: defaults$2.BASE_URL
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
                    const encodedResp = yield request$1({
                        method: method,
                        uri: `${_this._state.baseUrl}${path}`,
                        headers: Object.assign({}, defaultHeaders, headers),
                        qs: Case$1.convertCaseKeys(qs, Case$1.camelToSnake),
                        formData: Case$1.convertCaseKeys(formData, Case$1.camelToSnake),
                        body: Case$1.convertCaseKeys(body, Case$1.camelToSnake),
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
                        return reject(new RequestError$1(resp.error, encodedResp.statusCode));
                    }
                    return resolve(Case$1.convertCaseKeys(resp, Case$1.snakeToCamel));
                } catch (ex) {
                    try {
                        if (typeof ex.statusCode !== "number") {
                            return reject(ex);
                        }
                        const {error: error} = JSON.parse(ex.message);
                        return reject(new RequestError$1(error || ex.message, ex.statusCode));
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
    createSession({email: email, password: password, passcode: passcode, scope: scope = defaults$2.SCOPE, type: type = "permanent", params: params = {}}) {
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
                    const encodedCredentials = Base64$1.encode(credentials);
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
                    const encodedCredentials = Base64$1.encode(credentials);
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
    totpSecret() {
        return this.request({
            path: "/account/mfa/totp"
        });
    }
    mfa() {
        return this.request({
            path: "/account/mfa"
        });
    }
    coordinates(params = {}) {
        return this.request({
            path: "/coordinates",
            qs: params
        });
    }
    location(params = {}) {
        return this.request({
            path: "/location",
            qs: parsers$2.params.location.get(params)
        });
    }
    quality(params = {}) {
        return this.request({
            path: "/quality",
            qs: parsers$2.params.quality.get(params)
        });
    }
    batchQuality(paramsList = []) {
        return this.request({
            method: "POST",
            path: "/quality",
            body: parsers$2.params.quality.post(paramsList)
        });
    }
}

var sunburst = SunburstJS;

var sunburst$1 = Object.freeze({
    default: sunburst,
    __moduleExports: sunburst
});

var SunburstJS$1 = sunburst$1 && sunburst || sunburst$1;

var src = SunburstJS$1;

module.exports = src;
