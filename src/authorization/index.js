/*
  sunburst.js -- JavaScript Sunburst API Library

  MIT License
  Copyright (c) 2017 SunsetWx, LLC.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import * as constants from '../constants';
import * as endpoints from '../endpoints';
import * as utils from '../utils';

import * as opts from './options';
import * as helpers from './helpers';

import ResponsePool from 'response-pool';
import jwtDecode from 'jwt-decode';

export default class Authorization {
	constructor(options) {
		try {
			this.user = {};
			this.session = {};
			this.access = {
				renew: opts.renew(options),
				retry: opts.retry(options)
			};
			this.requests = {
				access: new ResponsePool(),
				session: new ResponsePool()
			};

			this.setUser(options);
			this.setSession(options);

/*
			if (opts.userObjInvalid(this) && opts.sessionObjInvalid(this)) {
				throw new Error(constants.errs.NoAuthOptions);
			}
*/
		}
		catch (ex) {
			throw ex;
		}
	}

	setUser({ email, password }, cb) {
		if ((email) && (password)) {
			this.user.email = email;
			this.user.password = password;
		}
		if (cb) cb(this.user);
	}

	setSession({ id, key }, cb) {
		if ((id) && (key)) {
			this.session.id = id;
			this.session.key = key;
		}
		if (cb) cb(this.session);
	}

	setToken(token, cb) {
		this.access.token = token;
		if (cb) cb(this.access.token);
	}

	getToken(respCb, errCb) {
		try {
			if (respCb) {
				if (this.isJWTValid()) {
					respCb(this.access.token);
				} else {
					this.login({}, respCb, errCb);
				}
			} else {
				throw new Error(constants.errs.CallbackRequired);
			}
		}
		catch (ex) {
			if (errCb) errCb(ex);
		}
	}

	isJWTValid(cb) {
		const { jwt } = this.access;
		if (!jwt) {
			return false;
		}
		const t = Date.now();
		return jwt.exp > utils.unixTime(t);
	}

	sendLogin(params, cb) {
		const { user, session } = this;
		const { email, password } = user;
		const { id, key } = session;
		const { type } = params;

		if ((id) && (key) && (!type)) {
			return endpoints.login.postLoginSession({ session: session }, params);
		}
		if ((email) && (password)) {
			return endpoints.login.postLogin({ user: user }, params);
		}
	}

	logout(respCb, errCb) {
		try {
			if (!respCb) throw new Error(constants.errs.CallbackRequired);
			utils.parseResponse(endpoints.logout.postLogout(auth), resp => {
				try {
					this.access.token = '';
					this.access.jwt = {};

					respCb(resp);
				}
				catch (ex) {
					if (errCb) errCb(ex);
				}
			}, errCb);
		}
		catch (ex) {
			if (errCb) errCb(ex);
		}
	}

	login(params, respCb, errCb) {
		if (!this.isJWTValid()) {
			const type = helpers.poolFromParams(params);				
			const rPool = this.requests[type];

			if (respCb && rPool.pending) {
				rPool.subVal(respCb, errCb); // If called concurrently, block until a response value is received from a queue.
				return;
			}

			const errHandler = ex => {
				const { retry } = this.access;
	
				rPool.reset();
				retry.exceptions++;
	
				if (retry.id) clearTimeout(retry.id);
				if (retry.enabled && retry.exceptions < retry.tries) {
					retry.id = setTimeout(() => this.login(params, respCb, errCb), retry.delay * 1000);
				}
	
				if (errCb) errCb(ex);
			};

			rPool.setPending();
			utils.parseResponse(this.sendLogin(params), ({ session, token, token_exp_sec }) => {
				if (session) rPool.pubVal(session, respCb);
				if (token) {
					this.setToken(token, token => {
						try {
							const { access } = this;
							const { renew, retry } = access;

							access.jwt = jwtDecode(token); // Decode the token string.										
							retry.exceptions = 0;          // Reset exceptions counter.

							if (renew.id) clearTimeout(renew.id);
							if (renew.enabled) {
								const ms = Math.abs(token_exp_sec + renew.offset) * 1000;
								renew.id = setTimeout(() => this.login(params, renew.callback, errCb), ms);
							}

							rPool.pubVal(token, respCb);
							rPool.done();
						}
						catch (ex) {
							errHandler(ex);
						}
					});
				}
			}, errHandler);
		}
	}
}