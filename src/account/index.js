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

export default class Account {
	constructor({ auth }) {
		try {
			if (!auth) throw new Error(constants.errs.NoAuthReference);
			this.auth = auth;
		}
		catch (ex) {
			throw ex;
		}
	}
	delete(respCb, errCb) {
		this.auth.getToken(token => {
			utils.parseResponse(
				endpoints.account.deleteAccount(token, {}),
				respCb,
				errCb
			);
		});
	}
	passwordReset(params, respCb, errCb) {
		utils.parseResponse(
			endpoints.account.postAccountPasswordReset(params),
			respCb,
			errCb
		);
	}
	getSessions(params, respCb, errCb) {
		this.auth.getToken(token => {
			utils.parseResponse(
				endpoints.account.getAccountSessions(token, params),
				respCb,
				errCb
			);
		});
	}
	deleteSessionByID(id, respCb, errCb) {
		this.auth.getToken(token => {
			utils.parseResponse(
				endpoints.account.deleteAccountSessionID(token, id, {}),
				respCb,
				errCb
			);
		});
	}
	deleteSessions(params, respCb, errCb) {
		this.auth.getToken(token => {
			utils.parseResponse(
				endpoints.account.deleteAccountSessions(token, params),
				respCb,
				errCb
			);
		});
	}
}