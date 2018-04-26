/*!
 * Sunburst API client library for JavaScript
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
export default {
  /**
   * snakeToCamel converts a snake-case string to camel-case.
   * @param   {string} str
   * @returns {string}
   */
  snakeToCamel(str) {
    return (
      str.replace(/_[a-zA-Z]/g, (strSlice) => (
        strSlice.toUpperCase().replace('_', '')
      ))
    );
  },

  /**
   * camelToSnake converts a camel-case string to snake-case.
   * @param   {string} str
   * @returns {string}
   */
  camelToSnake(str) {
    return (
      str.replace(/[A-Z]/g, (strSlice) => (
        `_${strSlice.toLowerCase()}`
      ))
    );
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

      Object.keys(obj).forEach((key) => {
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
