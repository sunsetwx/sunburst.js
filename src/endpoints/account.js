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
import * as utils from '../utils';

export function deleteAccount(token, params, options = constants.DefaultOptions) {
	return fetch(
		utils.handlerURL('account'),
		utils.fetchOpts.authWithBody(
			{
				access: {
					token: token
				}
			},
			params,
			options,
			'DELETE'
		)
	);
}

export function postAccountPasswordReset(params, options = constants.DefaultOptions) {
	return fetch(
		utils.handlerURL('account/password/reset'),
		utils.fetchOpts.authWithBody(
			{},
			params,
			options,
			'POST'
		)
	);
}

export function getAccountSessions(token, params, options = constants.DefaultOptions) {
	return fetch(
		utils.handlerURL('account/sessions'),
		utils.fetchOpts.authWithBody(
			{
				access: {
					token: token
				}
			},
			params,
			options,
			'GET'
		)
	);
}

export function deleteAccountSessionID(token, uriPathVar, params, options = constants.DefaultOptions) {
	return fetch(
		utils.handlerURL([ 'account/session', uriPathVar ].join('/')),
		utils.fetchOpts.authWithBody(
			{
				access: {
					token: token
				}
			},
			params,
			options,
			'DELETE'
		)
	);
}

export function deleteAccountSessions(token, params, options = constants.DefaultOptions) {
	return fetch(
		utils.handlerURL('account/sessions'),
		utils.fetchOpts.authWithBody(
			{
				access: {
					token: token
				}
			},
			params,
			options,
			'DELETE'
		)
	);
}