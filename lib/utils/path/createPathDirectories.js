'use strict';
/**
 * @module lib/utils/path/createPathDirectories
 * @author Renaud Lapoële
 */

/**
 * Module imports/dependencies
 */
const path = require('path');
const fs = require('fs');

/**
 * @function createPathDirectories
 * @param {string} filepath
 * @returns {void|boolean} true if the directory(ies) already exist nothing otherwise.
 * @description Creates missing path directories.
 */
function createPathDirectories(filepath) {
  const dirname = path.dirname(filepath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createPathDirectories(dirname);
  fs.mkdirSync(dirname);
}

/**
 * Module exports.
 */
module.exports = createPathDirectories;
