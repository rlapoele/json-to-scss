'use strict';
/**
 * @module lib/utils/transformation/flattenObject
 * @author Renaud Lapoële
 */

/**
 * @function flattenObject
 * @param {Object} obj
 * @param {string} keyCase
 * @returns {Object} a flattened object.
 * @description A function to flatten an object's nested objects/props.
 */
function flattenObject(
  obj,
  keyCase = 'kebab'
) {
  const _keyCase = -1 < ['kebab','camel'].indexOf(keyCase) ? keyCase : 'kebab';
  const _obj = !!obj ? obj : {};
  
  function _flatten(obj, currentKey = '', keyCase = 'kebab') {
    return Object.keys(obj).reduce(
      (acc, key) => {
        let newKey = '';
        if ('camel' === keyCase) {
          newKey = '' === currentKey ? key : `${currentKey}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        }
        else {
          newKey = '' === currentKey ? key : `${currentKey}-${key}`;
        }
        if ('object' === typeof obj[key] && !Array.isArray(obj[key]))
          acc = { ...acc, ..._flatten(obj[key], newKey, keyCase) };
        else
          acc[newKey] = obj[key];
        return acc;
      },
      {}
    );
  }
  return _flatten(_obj, '', _keyCase);
}

/**
 * Module exports.
 */
module.exports = flattenObject;
