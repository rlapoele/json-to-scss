'use strict';
/**
 * @module lib/utils/path/removeExtension
 * @author Renaud Lapoële
 */

/**
 * Module imports/dependencies
 */
const path = require('path');

/**
 * @function removeExtension
 * @param {string} filePath - path from which file extension(s) must be removed.
 * @param {boolean} removeExtensionRecursively - indicates if, in case file path has multiple extensions, extensions must all be removed.
 * @returns {string} the file path with less or without any file extension.
 * @description Removes one and/or all file extensions from a file path.
 */
function removeExtension(filePath, removeExtensionRecursively = false) {
  const _extname = path.extname(filePath);
  if ('' === _extname) {
    return filePath;
  } else {
    const _filePath = path.join(
      path.dirname(filePath),
      path.basename(filePath, _extname)
    );
    if (removeExtensionRecursively) {
      if ('' === path.extname(_filePath)) {
        return _filePath;
      } else {
        return removeExtension(_filePath);
      }
    } else {
      return _filePath;
    }
  }
}

/**
 * Module exports.
 */
module.exports = removeExtension;
