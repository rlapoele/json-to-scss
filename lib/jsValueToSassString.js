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
const FN_FORMAT_AUTO = 'auto';
const FN_DEFAULT_KEY_FORMAT = FN_FORMAT_AUTO;
const FN_DEFAULT_VALUE_FORMAT = FN_FORMAT_AUTO;
const FN_DEFAULT_STRING_KEYS = [];
const FN_FORMAT_SINGLE_QUOTED = 'sq';

/**
 * @function jsValueToSassString
 * @param {*} value - the js value to be converted into a string compatible with sass/scss syntax.
 * @param {string} indentationText - the string to be used as indentation text.
 * @param {number} indentationSize - the number of time the indentation text must be repeated per indentation level.
 * @param {string} emptyString
 * @param {string} keyFormat - an indicator telling how sass map keys must be formatted.
 * @param {string} valueFormat - an indicator telling how sass map values must be formatted.
 * @param {array} stringKeys - an array containing property names for which values must be forcefully "quoted" (e.g: font-family).
 * @returns {string} string sass representation of the value.
 * @description Converts a javascript value into a string compatible with sass/scss syntax.
 */
function jsValueToSassString(
  value,
  indentationText = FN_DEFAULT_INDENTATION_TEXT,
  indentationSize = FN_DEFAULT_INDENTATION_SIZE,
  emptyString = FN_DEFAULT_EMPTY_STRING,
  keyFormat = FN_DEFAULT_KEY_FORMAT,
  valueFormat = FN_DEFAULT_VALUE_FORMAT,
  stringKeys= FN_DEFAULT_STRING_KEYS
) {
  
  /**
   * @private
   * @function _formatString
   * @param {string} string - the string to be formatted.
   * @param {string} format - the format to be used.
   * @returns {string}
   */
  function _formatString(string, format) {
    if ('string' !== typeof string) {
      return string;
    }
    if (!string) {
       return format === FN_FORMAT_AUTO ?
        emptyString :
        format === FN_FORMAT_SINGLE_QUOTED ?
          "''":
          '""';
    }
    else {
      let sqRegExp = /'/g;
      let dqRegExp = /"/g;
      let _sqString = string.replace(sqRegExp, '"');
      let _dqString = string.replace(dqRegExp, "'");
      return format === FN_FORMAT_AUTO ?
        string :
        format === FN_FORMAT_SINGLE_QUOTED ?
          `'${_sqString}'` :
          `"${_dqString}"`;
    }
  }
  
  function _quoteIfStringKey(propertyName, value, quoteFormat) {
    if ('' !== propertyName) {
      if (stringKeys.includes(propertyName.toUpperCase())) {
        return quoteFormat === FN_FORMAT_SINGLE_QUOTED ? `'${value}'` : `"${value}"`;
      }
    }
    return value;
  }
  
  
  // computed flag.
  const mustIndent = '' !== indentationText && 0 !== indentationSize;
  
  /**
   * @private
   * @function _process
   * @param {*|string} propertyName - the property for which the value is being processed.
   * @param {*} value - the js value to be converted into a sass string.
   * @param {number} indentationLevel - a positive integer reflecting the desired level of indentation.
   * @returns {*|string} string sass representation of the value.
   * @description actual implementation of the `jsValueToSassString` function.
   */
  function _process(propertyName, value, indentationLevel) {
    const _switch = {
      boolean: () => _formatString(value.toString(), valueFormat),
      number: () => _formatString(value.toString(), valueFormat),
      string: () => _formatString(value, valueFormat),
      object: () => {
        if (isPlainObject(value)) {
          let _jsObj = value;
          let _sassKeyValPairs = Object.keys(_jsObj).reduce(
            (result, key) => {
              let _jsVal = _jsObj[key];
              let _propName = isPlainObject(_jsVal) ? '' : key;
              let _sassVal = _process(_propName, _jsVal, indentationLevel + 1);
              if (!isUndefined(_sassVal)) {
                result.push(`${_formatString(key, keyFormat)}: ${_quoteIfStringKey(_propName, _sassVal, valueFormat)}`);
              }
              return result;
            },
            []
          );
          
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
          } else
            _result = `(${_sassKeyValPairs.join(', ')})`;
          
          return _result;
        }
        else if (isArray(value)) {
          let _sassVals = value.reduce(
            (result, v) => {
              if (!isUndefined(v))
                result.push(_process('', v, indentationLevel));
              return result;
            },
            []
          );
          return `(${_sassVals.join(', ')})`;
        }
        else if (isNull(value)) {
          return 'null';
        }
        return _formatString(value.toString(), valueFormat);
      },
      default: () => {}
    };
    return (_switch[typeof value] || _switch['default'])();
  }
  
  return _process('', value, 0);
}

/**
 * Module exports.
 */
module.exports = jsValueToSassString;
