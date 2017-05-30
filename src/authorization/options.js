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

export function renew({ renew = {} }) {
	const { enabled, offset, callback } = renew;
	return {
		enabled: enabled === false ? false : true,
		offset: offset ? offset : -300,
		callback: callback ? callback : null
	};
}

export function retry({ retry = {} }) {
	const { enabled, tries, delay } = retry;
	return {
		enabled: enabled === false ? false : true,
		tries: tries ? tries : 10,
		delay: delay ? delay : 5
	};
}

export function userObjInvalid({ user }) { return !user.email || !user.password; }
export function sessionObjInvalid({ session }) { return !session.id || !session.key; }