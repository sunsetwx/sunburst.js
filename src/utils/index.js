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
import * as coords from './coords';
import * as fetchOpts from './fetch-opts';
import * as uriEncoder from './uri-encoder';
import * as quality from './quality';

export {
	coords,
	fetchOpts,
	uriEncoder,
	quality
};

export function parseResponse(promise, respCb, errCb) {
	promise
		.then(resp => resp.json()) // Unmarshal the JSON data.
		.then(resp => {
			if (resp.error) throw new Error(resp.error);
			return resp;
		})
		.then(respCb, errCb);
}

export function handlerURL(endpoint, params, options = constants.DefaultOptions) {
	const handlerURL = [
		options.protocol,
		'://',
		options.baseURL,
		'/v',
		options.version.major.toString(),
		'/',
		endpoint
	]
	.join('');

	if (!params) {
		return handlerURL;
	}

	return [
		handlerURL,
		uriEncoder.serialize(params)
	]
	.join('?');
}

export function unixTime(t) {
	return t / 1000 | 0;
}