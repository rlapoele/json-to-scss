'use strict';
/**
 * @module lib/utils/inspection/isNull
 * @author Renaud Lapoële
 */

/**
 * @function isNull
 * @param {*} value
 * @returns {boolean} true if the value is null, false otherwise
 * @description A function to check whether a given value is null or not.
 */
function isNull(value) {
  return value === null;
}

/**
 * Module exports.
 */
module.exports = isNull;
