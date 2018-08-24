'use strict';
/**
 * @module json-to-scss/lib/jsJsonFilesToSassScssFiles
 */


/**
 * Modules imports/dependencies.
 */
const fs                      = require('fs');
const path                    = require('path');
const terminal                = require('terminal-overwrite');
const emoji                   = require('node-emoji');
const chalk                   = require('chalk');
const pathBasename            = require('../lib/utils/path/basename');
const createPathDirectories   = require('../lib/utils/path/createPathDirectories');
const jsValueToSassString     = require('../lib/jsValueToSassString');


/**
 * @function jsJsonFilesToSassScssFiles
 * @param {array} sourceFilepaths
 * @param {array} destinationFilepaths
 * @param {object} options
 * @description Converts node js (.js files exporting an object...) & json files to sass or scss files.
 */
function jsJsonFilesToSassScssFiles(sourceFilepaths, destinationFilepaths, options) {
  
  sourceFilepaths.forEach(
    function(filepath, index) {
      terminal(`${emoji.get('gear')} ${chalk.blue(filepath)}:`);
      const filepathExtension = path.extname(filepath);
      if (-1 === ['.js','.json'].indexOf(filepathExtension)) {
        terminal(`${emoji.get('x')}  ${chalk.blue(filepath)}: unsupported file format. ${chalk.yellow('File skipped!')}\n`);
      }
      else {
        const _options = { ...options };
        if ('' === _options.prefix) {
          _options.prefix=`$${pathBasename(filepath)}: `;
        }
        if ('.sass' === _options.format) {
          _options.indentationSize = 0;
          if (_options.suffix.endsWith(';')) { _options.suffix = ''; }
        }
        
        const jsModule = require(filepath);
        const jsonString = JSON.stringify(jsModule);
        const sassString = `${jsValueToSassString(JSON.parse(jsonString), _options)}`;
        terminal(`${emoji.get('hourglass_flowing_sand')} ${chalk.blue(filepath)}: content converted.`);
        if ('{}' === jsonString) {
          terminal(`${emoji.get('-1')} ${chalk.blue(filepath)}: no useful content found. ${chalk.yellow('File Skipped!')}\n`);
        }
        else {
          createPathDirectories(destinationFilepaths[index]);
          fs.writeFileSync(destinationFilepaths[index],`${_options.prefix}${sassString}${_options.suffix}`);
          terminal(`${emoji.get('hourglass')} ${chalk.blue(filepath)}: content converted. ${chalk.green('File created!')}\n`);
          terminal(`   ${emoji.get('+1')} ${chalk.green(destinationFilepaths[index])}\n`);
        }
      }
    }
  );
}


/**
 * Module exports.
 */
module.exports = jsJsonFilesToSassScssFiles;