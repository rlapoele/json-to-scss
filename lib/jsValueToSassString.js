'use strict';
/**
 * @module json-to-scss/lib/jsValueToSassString
 * @author Renaud Lapoële
 */

/**
 * Module imports/dependencies.
 */
const isPlainObject = require('lodash.isplainobject');
const isNull = require('./utils/inspection/isNull');
const isUndefined = require('./utils/inspection/isUndefined');
const { isArray } = Array;

/**
 * Module constants (or alike)
 */
const FN_DEFAULT_INDENTATION_TEXT = '  ';
const FN_DEFAULT_INDENTATION_SIZE = 1;
const FN_DEFAULT_EMPTY_STRING = '""';

/**
 * @function jsValueToSassString
 * @param {*} value - the js value to be converted into a string compatible with sass/scss syntax.
 * @param {string} indentationText - the string to be used as indentation text.
 * @param {number} indentationSize - the number of time the indentation text must be repeated per indentation level.
 * @param {string} emptyString
 * @returns {string} string sass representation of the value.
 * @description Converts a javascript value into a string compatible with sass/scss syntax.
 */
function jsValueToSassString(
  value,
  indentationText = FN_DEFAULT_INDENTATION_TEXT,
  indentationSize = FN_DEFAULT_INDENTATION_SIZE,
  emptyString = FN_DEFAULT_EMPTY_STRING
) {
  // computed flag.
  const mustIndent = '' !== indentationText && 0 !== indentationSize;

  /**
   * @private
   * @function _process
   * @param {*} value - the js value to be converted into a sass string.
   * @param {number} indentationLevel - a positive integer reflecting the desired level of indentation.
   * @returns {*|string} string sass representation of the value.
   * @description actual implementation of the `jsValueToSassString` function.
   */
  function _process(value, indentationLevel) {
    const _switch = {
      boolean: () => value.toString(),
      number: () => value.toString(),
      string: () => (!value ? emptyString : value),
      object: () => {
        if (isPlainObject(value)) {
          let _jsObj = value;
          let _sassKeyValPairs = Object.keys(_jsObj).reduce((result, key) => {
            let _jsVal = _jsObj[key];
            let _sassVal = _process(_jsVal, indentationLevel + 1);
            if (!isUndefined(_sassVal)) {
              result.push(`${key}: ${_sassVal}`);
            }
            return result;
          }, []);

          let _result = '';
          if (mustIndent) {
            let _indentIn = indentationText.repeat(
              indentationSize * (indentationLevel + 1)
            );
            let _indentOut = indentationText.repeat(
              indentationSize * indentationLevel
            );
            _result = `(\n${_indentIn +
              _sassKeyValPairs.join(`,\n${_indentIn}`)}\n${_indentOut})`;
          } else _result = `(${_sassKeyValPairs.join(', ')})`;

          return _result;
        } else if (isArray(value)) {
          let _sassVals = value.reduce((result, v) => {
            if (!isUndefined(v)) result.push(_process(v, indentationLevel));
            return result;
          }, []);

          return `(${_sassVals.join(', ')})`;
        } else if (isNull(value)) return 'null';
        else return value.toString();
      },
      default: () => {}
    };

    return (_switch[typeof value] || _switch['default'])();
  }

  return _process(value, 0);
}

/**
 * Module exports.
 */
module.exports = jsValueToSassString;
