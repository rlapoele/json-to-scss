'use strict';
/**
 * @module lib/utils/inspection/isPositiveInteger
 * @author Renaud Lapoële
 */

/**
 * Module imports.
 */
const isInteger = require('lodash.isinteger');

/**
 * @function isPositiveInteger
 * @param {*} value - the value to check.
 * @returns {boolean} true if the value passed as argument is an integer and is positive.
 * @description A function to check whether a given value is a positive integer or not.
 */
function isPositiveInteger(value) {
  return isInteger(value) && 0 <= value;
}

/**
 * Module exports.
 */
module.exports = isPositiveInteger;
