'use strict';
/**
 * @module lib/utils/inspection/isBoolean
 * @author Renaud Lapoële
 */

/**
 * @function isBoolean
 * @param {*} value - the value to check.
 * @returns {boolean} true if the given value is a boolean, false otherwise.
 * @description A Function to verify whether a value is a boolean or not.
 */
function isBoolean(value) {
  return typeof value === 'boolean';
}

/**
 * Module exports.
 */
module.exports = isBoolean;
