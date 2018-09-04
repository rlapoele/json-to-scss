'use strict';
/**
 * @module json-to-scss/lib/jsJsonFilesToSassScssFiles
 * @author Renaud Lapoële
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
const hasExtension            = require('../lib/utils/path/hasExtension');
const createPathDirectories   = require('../lib/utils/path/createPathDirectories');
const isBoolean               = require('../lib/utils/inspection/isBoolean');
const isPositiveInteger       = require('../lib/utils/inspection/isPositiveInteger');
const isString                = require('../lib/utils/inspection/isString');
const jsValueToSassString     = require('../lib/jsValueToSassString');


/**
 * @function jsJsonFilesToSassScssFiles
 * @param {array} sourceFilepaths - an array of "resolved" source file paths.
 * @param {array} destinationFilepaths - an array of destination file paths; it length must be equal to the source file path array's length.
 * @param {string} prefix
 * @param {string} suffix
 * @param {string} format
 * @param {string} indentationText
 * @param {number} indentationSize
 * @param {string} emptyString - '' or "".
 * @param {boolean} noUnderscore
 * @description Converts node js (.js files exporting an object...) & json files to sass or scss files.
 */
function jsJsonFilesToSassScssFiles (
  sourceFilepaths,
  destinationFilepaths,
  prefix,
  suffix,
  format,
  indentationText,
  indentationSize,
  emptyString,
  noUnderscore
) {
  
  function _convertFile (filepath, fileindex) {
    
    terminal(`${emoji.get('gear')} ${chalk.blue(filepath)}:`);
    const _filepathExtension = path.extname(filepath);
    
    // skip any files if extension is <> than ".js" or ".json".
    if (-1 === ['.js','.json'].indexOf(_filepathExtension)) {
      terminal(`${emoji.get('x')}  ${chalk.blue(filepath)}: unsupported file format: "${_filepathExtension}". ${chalk.yellow('File skipped!')}\n`);
    }
    else {
      
      let _prefix = prefix;
      let _suffix = suffix;
      let _indentationText = indentationText;
      let _indentationSize = indentationSize;
      let _emptyString = emptyString;
      let _noUnderscore = noUnderscore;
      let _destinationFilepath = destinationFilepaths[fileindex];
      let _destinationFilename = '';
      let _jsObject = {};
      let _errorFlag = false;
      
      // let's try to "import" the source file.
      try {
        _jsObject = require(filepath);
      }
      catch(error) {
        // Oops - something went wrong (most likely a JSON format error).
        terminal(`${emoji.get('-1')} ${chalk.blue(filepath)}: error(s) found while parsing; content skipped. ${chalk.yellow('File skipped!')}\n`);
        _errorFlag = true;
      }
      
      // verify that no error occurred previously and if it did, then skip the
      // rest of the process for the concerned file.
      if(!_errorFlag) {
        
        // let's check if the source content has a local config (option set)
        // defined.
        if (_jsObject._jsonToScss) {
          
          // if yes, then use its content.
          if (_jsObject._jsonToScss.prefix && isString(_jsObject._jsonToScss.prefix)) {
            _prefix = _jsObject._jsonToScss.prefix;
          }
          
          if (_jsObject._jsonToScss.suffix && isString(_jsObject._jsonToScss.suffix)) {
            _suffix = _jsObject._jsonToScss.suffix;
          }
          
          if (_jsObject._jsonToScss.indentationText && isString(_jsObject._jsonToScss.indentationText)) {
            _indentationText = _jsObject._jsonToScss.indentationText;
          }
          
          if (_jsObject._jsonToScss.indentationSize && isPositiveInteger(_jsObject._jsonToScss.indentationSize)) {
            _indentationSize = _jsObject._jsonToScss.indentationSize;
          }
          
          if (_jsObject._jsonToScss.emptyString && (('""' === _jsObject._jsonToScss.emptyString) || ("''" === _jsObject._jsonToScss.emptyString))) {
            _emptyString = _jsObject._jsonToScss.emptyString;
          }
          
          if (_jsObject._jsonToScss.noUnderscore && isBoolean(_jsObject._jsonToScss.noUnderscore)) {
            _noUnderscore = _jsObject._jsonToScss.noUnderscore;
          }
          
          if (_jsObject._jsonToScss.sassVariableName && isString(_jsObject._jsonToScss.sassVariableName) && _jsObject._jsonToScss.sassVariableName.length) {
            _prefix = `$${_jsObject._jsonToScss.sassVariableName}: `;
          }
          
          if (_jsObject._jsonToScss.filename && isString(_jsObject._jsonToScss.filename) && _jsObject._jsonToScss.filename.length) {
            _destinationFilename =
              hasExtension(_jsObject._jsonToScss.filename) ?
                pathBasename(_jsObject._jsonToScss.filename) :
                _jsObject._jsonToScss.filename;
            
            if (_destinationFilename.length) {
              _destinationFilepath =
                `${path.join(path.dirname(_destinationFilepath), _destinationFilename)}${path.extname(_destinationFilepath)}`
            }
          }
          
          // let us remove the local config from the content.
          delete _jsObject._jsonToScss;
        }
        
        // if no prefix is specified, set it using the destination filename as
        // sass variable name.
        if ('' === _prefix) {
          _prefix = `$${pathBasename(_destinationFilepath)}: `;
        }
        
        // if sass format is required then disable the sass content indentation
        // and if the suffix starts and/or ends with ";" then remove it.
        // this is currently kept basic as it could become very complex very
        // fast otherwise.
        if ('.sass' === format) {
          _indentationSize = 0;
          _suffix = _suffix.trim();
          
          if (_suffix.startsWith(';')) {
            _suffix = _suffix.slice(1);
          }
          
          if (_suffix.endsWith(';')) {
            _suffix = _suffix.slice(0, -1);
          }
        }
        
        // let's see if the --no-underscore option was set and if so, then while
        // the prefix starts with "$_" let's remove the "_".
        if (_noUnderscore) {
          while (_prefix.startsWith('$_')) {
            _prefix = `$${_prefix.slice(2)}`;
          }
        }
        
        // convert the js object into a sass string.
        const _sassString = `${jsValueToSassString(_jsObject, _indentationText, _indentationSize, _emptyString)}`;
        terminal(`${emoji.get('hourglass_flowing_sand')} ${chalk.blue(filepath)}: content converted.`);
        if (0 === Object.keys(_jsObject).length) {
          terminal(`${emoji.get('-1')} ${chalk.blue(filepath)}: no convertible content found. ${chalk.yellow('File skipped!')}\n`);
        }
        else {
          try {
            // ensure that the destination directory(ies) exist and if not create
            // it.
            createPathDirectories(_destinationFilepath);
            
            // let's write the file.
            fs.writeFileSync(_destinationFilepath, `${_prefix}${_sassString}${_suffix}\n`);
            
            terminal(`${emoji.get('hourglass')} ${chalk.blue(filepath)}: content converted. ${chalk.green('File created!')}\n`);
            terminal(`   ${emoji.get('+1')} ${chalk.green(_destinationFilepath)}\n`);
          }
          catch (error) {
            terminal(`${emoji.get('-1')} ${chalk.blue(filepath)}: Oops! Something went wrong when trying to write the converted file. ${chalk.yellow('File skipped!')}\n`);
          }
        }
      }
    }
  }

  // iterate through each input source file and perform conversion when possible.
  sourceFilepaths.forEach(_convertFile);
  
}


/**
 * Module exports.
 */
module.exports = jsJsonFilesToSassScssFiles;