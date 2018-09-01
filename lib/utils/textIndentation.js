'use strict';
/**
 * @module lib/utils/textIndentation
 * @author Renaud Lapoële
 */


/**
 * Module imports/dependencies
 */
const { inspect } = require('util');
const isPositiveInteger = require('../utils/inspection/isPositiveInteger');


/**
 * Module constants
 */
const FN_SIGNATURE = 'textIndentation(indentationText, indentationSize, indentationLevel[, config])';
const FN_DEFAULT_CONFIG = {
  defaults: {
    text: ' ',
    size: 1,
    level: 0
  },
  mustValidateInput: false,
  throwOnValidationError : false
};

/**
 * @function _textIndentation
 * @param {string} indentationText - character or text to be used to indent sass map key:value pairs.
 * @param {number} indentationSize - number of time the `indentationChar` must be repeated over to form the textIndentation text.
 * @param {number} indentationLevel - describes the number of times the textIndentation text must be repeated.
 * @param {object} config - contains the function config made of 3 properties such as 'defaults' (object), 'mustValidateInput' (boolean) and 'throwOnValidationError' (boolean).
 * @returns {*|string} string representing the computed textIndentation.
 * @description - Computes a text indentation string based on an input text, an indentation size and indentation level.
 */
function textIndentation(
  indentationText,
  indentationSize,
  indentationLevel,
  config = FN_DEFAULT_CONFIG
) {
  
  let _text = indentationText;
  let _size = indentationSize;
  let _level = indentationLevel;
  const _config = { ...FN_DEFAULT_CONFIG, ...config };
  
  if (_config.mustValidateInput) {
    if (!isString(_text)) {
      if (_config.throwOnValidationError) throw new TypeError(`${FN_SIGNATURE}: indentationText must be a 'string'. Received '${typeof _text}' = ${inspect(_text)}.`);
      else _text = config.defaults.text;
    }
    if (!isPositiveInteger(_size)) {
      if (_config.throwOnValidationError) throw new Error(`${FN_SIGNATURE}: indentationSize must be a positive 'integer'. Received '${typeof _size}' = ${inspect(_size)}.`);
      else _size = config.defaults.size;
    }
    if (!isPositiveInteger(_level)) {
      if (_config.throwOnValidationError) throw new Error(`${FN_SIGNATURE}: indentationLevel must be a positive 'integer'. Received '${typeof _level}' = ${inspect(_level)}.`);
      else _level = config.defaults.level;
    }
  }
  return _text.repeat(_size * _level);
}


/**
 * Module exports.
 */
module.exports = textIndentation;
