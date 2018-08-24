const path = require('path');
const fs = require('fs');


/**
 * Create missing path directories.
 * @param {string} filepath
 * @returns {boolean}
 */
function createPathDirectories(filepath) {
//  const dirname = (('' === path.extname(filepath)) && ('dummy' !== path.basename()) )? path.join(path.dirname(filepath),'/dummyDir') : path.dirname(filepath);
  const dirname = path.dirname(filepath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createPathDirectories(dirname);
  fs.mkdirSync(dirname);
}


module.exports = createPathDirectories;