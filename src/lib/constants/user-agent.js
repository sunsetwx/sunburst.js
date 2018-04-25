/*!
 * Sunburst API client library for Node.js and in-browser JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

import { name, version } from '../../../package.json';

const userAgent = [];

if (typeof navigator !== 'undefined' && navigator.userAgent) {
  userAgent.push(navigator.userAgent);
}

if (typeof process !== 'undefined' && process.versions) {
  userAgent.push(Object.keys(process.versions).map((key) => (
    `${key}/${process.versions[key]}`
  )).join(' '));
}

userAgent.push(`${name}/${version}`);

export default userAgent.join(' ');
