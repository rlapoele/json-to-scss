'use strict';
/**
 * @module lib/utils/path/hasExtension
 * @author Renaud Lapoële
 */

/**
 * Module imports/dependencies.
 */
const path = require('path');

/**
 * @function hasExtension
 * @param {string} filePath - the file path for which one wants to know if it has an extension.
 * @returns {boolean} true if the file path given as argument has an extension (.xxx), false otherwise.
 * @description Returns true if the filePath has an extension.
 */
function hasExtension(filePath) {
  return '' !== path.extname(filePath);
}

/**
 * Module exports.
 */
module.exports = hasExtension;
