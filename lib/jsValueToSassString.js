'use strict';
/**
 * @module json-to-scss/lib/converter/jsToSassString
 */


/**
 * Module imports/dependencies.
 */
const isPlainObject     = require('lodash.isplainobject');
const isNull            = require('./utils/inspection/isNull');
const isPositiveInteger = require('./utils/inspection/isPositiveInteger');
const isString          = require('./utils/inspection/isString');
const isUndefined       = require('./utils/inspection/isUndefined');
const textIndentation   = require('./utils/textIndentation');
const { isArray } = Array;


/**
 * Module constants (or alike)
 */
const FN_DEFAULT_CONFIG = {
  indentationText: "  ",
  indentationSize: 1,
  emptyString: '""'
};


/**
 * @function jsValueToSassString
 * @param {*} value - the js value to be converted into a string compatible with sass/scss syntax.
 * @param {object} config - function options relative to indentation & sass/scss empty string representation.
 * @returns {string} string sass representation of the value.
 * @description Converts a javascript value into a string compatible with sass/scss syntax.
 */
function jsValueToSassString(
  value,
  config = FN_DEFAULT_CONFIG
) {
  

  /**
   * @private
   * @function _normalizeConfig
   * @returns {object} a normalized configuration object.
   * @description Validates, corrects if need be all the required config passed in argument and extend with a boolean 'mustIndent' indicating whether the converted js object must be indented or not.
   */
  function _normalizeConfig() {
    let _nc = { ...FN_DEFAULT_CONFIG, ...config };
    if (!isPositiveInteger(_nc.indentationSize)) {
      _nc.indentationSize = FN_DEFAULT_CONFIG.indentationSize;
    }
    if (!isString(_nc.emptyString)) {
      _nc.emptyString = FN_DEFAULT_CONFIG.emptyString;
    }
    if (!isString(_nc.indentationText)) {
      _nc.indentationText = FN_DEFAULT_CONFIG.indentationText;
    }
    return { ..._nc, mustIndent: ('' !== _nc.indentationText) && (0 !== _nc.indentationSize) };
  }
  
  
  /**
   * @private
   * @function _jsToSassString
   * @param {*} value - the js value to be converted into a string compatible with sass/scss syntax.
   * @param {number} indentationLevel -
   * @returns {*|string} string sass representation of the value.
   * @description actual implementation of the `jsValueToSassString` function.
   */
  function _jsToSassString(
    value,
    indentationLevel = 0
  ) {
    
    switch (typeof value) {
    case 'boolean':
    case 'number':
      return value.toString();
    case 'string':
      return !value ? _config.emptyString : value;
    case 'object':
      if (isPlainObject(value)) {
        
        let _jsObj = value;
        let _sassKeyValPairs = [];
        
        _sassKeyValPairs = Object.keys(_jsObj)
          .reduce((result, key) => {
            let _jsVal = _jsObj[key];
            let _sassVal = _jsToSassString(_jsVal, indentationLevel + 1);
            
            if (!isUndefined(_sassVal)) {
              result.push(`${key}: ${_sassVal}`);
            }
            
            return result;
          }, []);
        
        let _result = '';
        if (_config.mustIndent) {
          let _indentIn = textIndentation(_config.indentationText, _config.indentationSize, indentationLevel + 1);
          let _indentOut = textIndentation(_config.indentationText, _config.indentationSize, indentationLevel);
          _result = `(\n${_indentIn + _sassKeyValPairs.join(`,\n${_indentIn}`)}\n${_indentOut})`;
        }
        else _result = `(${_sassKeyValPairs.join(', ')})`;
        
        return _result;
      }
      else if (isArray(value)) {
        let _sassVals = value
          .reduce((result, v) => {
            if (!isUndefined(v)) result.push(_jsToSassString(v, indentationLevel));
            return result;
          }, []);
        
        return `(${_sassVals.join(', ')})`;
      }
      else
      if (isNull(value)) return 'null';
      else return value.toString();
    default:
      return;
    }
  }
  
  const _config = _normalizeConfig();
  
  return _jsToSassString(value);
}


/**
 * Module exports.
 */
module.exports = jsValueToSassString;