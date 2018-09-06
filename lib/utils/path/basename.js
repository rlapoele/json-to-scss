'use strict';
/**
 * @module lib/utils/path/basename
 * @author Renaud Lapoële
 */

/**
 * Module imports/dependencies.
 */
const path = require('path');

/**
 * @function basename
 * @param {string} filePath
 * @returns {string} the basename of the file path minus its extension(s).
 * @description Extract a file name from a file path.
 */
function basename(filePath) {
  const _filePathExtension = path.extname(filePath);
  const _filePathBasename = path.basename(filePath, _filePathExtension);
  return '' !== _filePathExtension
    ? basename(_filePathBasename)
    : _filePathBasename;
}

/**
 * Module exports.
 */
module.exports = basename;
