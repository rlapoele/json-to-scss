'use strict';
/**
 * @module lib/utils/path/removeExtension
 */


/**
 * Module imports/dependencies.
 */
const path = require('path');
const { inspect } = require('util');


const FN_DEFAULT_CONFIG = { mustValidateInput: true, recurse: true};

/**
 * @function removeExtension
 * @param {string} filePath - path from which file extension(s) must be removed.
 * @param {object} config - function config/options. Default: { mustValidateInput: true, recurse: false}.
 * @returns {string} the file path without any file extension.
 * @throws an error if 'filePath' is not a 'string'.
 * @description Removes any and all file extensions from a file path.
 */
function removeExtension(filePath, config = FN_DEFAULT_CONFIG) {
  const _config = { ...FN_DEFAULT_CONFIG, ...config };
  
  if (_config.mustValidateInput === true) {
    const _typeofFilePath = typeof filePath;
    if ('string' !== _typeofFilePath) {
      throw new TypeError(`removeExtension(filePath[, config]): filePath must be a 'string'. Received '${_typeofFilePath}' = ${inspect(filePath)}.`);
    }
  }
  const _extname = path.extname(filePath);
  if ('' === _extname) {
    return filePath;
  }
  else {
    const _filePath = path.join(path.dirname(filePath), path.basename(filePath, _extname));
    if (_config.recurse === true) {
      if ('' === path.extname(_filePath)) {
        return _filePath;
      }
      else {
        return removeExtension(_filePath);
      }
    }
    else {
      return _filePath;
    }
  }
}


/**
 * Module exports.
 */
module.exports = removeExtension;