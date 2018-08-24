'use strict';

/**
 * @module lib/utils/inspection/isString
 */

/**
 * @function isString
 * @param {*} value - the value to check.
 * @returns {boolean} - true if the given value is a string, false otherwise.
 * @description A Function to verify whether a value is a string or not.
 */
function isString(value) {
  return typeof value === 'string';
}

module.exports = isString;