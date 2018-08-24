'use strict';

/**
 * @module lib/utils/inspection/isNull
 */

/**
 * @function isNull
 * @param value
 * @returns {boolean} return true if the value is null, false otherwise
 * @description A function to check whether given value is null or not.
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;