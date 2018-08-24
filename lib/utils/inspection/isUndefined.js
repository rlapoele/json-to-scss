'use strict';

/**
 * @module lib/utils/inspection/isUndefined
 */

/**
 * @function isUndefined
 * @param {*} value - the value to check.
 * @returns {boolean} - true if the typeof value is 'undefined' and false otherwise.
 * @description A Function to verify whether a value is undefined or not.
 */
function isUndefined(value) {
  return typeof value === 'undefined';
}

module.exports = isUndefined;
