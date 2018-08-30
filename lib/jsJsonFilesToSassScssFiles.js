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
const hasExtension            = require('../lib/utils/path/hasExtension');
const createPathDirectories   = require('../lib/utils/path/createPathDirectories');
const isString                = require('../lib/utils/inspection/isString');
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
      
      // skip any files if extension is <> than ".js" or ".json".
      if (-1 === ['.js','.json'].indexOf(filepathExtension)) {
        terminal(`${emoji.get('x')}  ${chalk.blue(filepath)}: unsupported file format. ${chalk.yellow('File skipped!')}\n`);
      }
      else {
        // initialize an error flag for the concerned file.
        let _errorFlag = false;
        
        // copy general options.
        let _options = { ...options };
        
        // let's save the format here so that one cannot change it locally.
        const _format = _options.format;
        
        // let's load the file using node require.
        // wrap the whole thing in try catch so that, if, for example, a json
        // file contains a format error, the "problem" is intercepted and the
        // file can be skipped.
        let _jsObject = {};
        try {
          _jsObject = require(filepath);
        }
        catch(error) {
          terminal(`${emoji.get('-1')} ${chalk.blue(filepath)}: error(s) found while parsing; content skipped. ${chalk.yellow('File skipped!')}\n`);
          _errorFlag = true;
        }
        
        // verify that no error occurred previously and if it did, then skip the
        // rest of the process for the concerned file.
        if(!_errorFlag) {
          // let's check if the source content has a local config (option set)
          // defined.
          if (_jsObject._jsonToScss) {
    
            // if yes, then merge it with the global options.
            _options = {..._options, ..._jsObject._jsonToScss};
    
            // let's check if the local conf. contains a "sassVariableName" prop
            // and if so then use it as prefix and therefore overwrite the prefix
            // option.
            if (_options.sassVariableName && isString(_options.sassVariableName) && _options.sassVariableName.length) {
              _options.prefix = `$${_options.sassVariableName}: `;
            }
    
            // let's check if the local conf. contains a "filename" prop and if
            // that's the case then try to use it as destination file NAME.
            if (_options.filename && isString(_options.filename) && _options.filename.length) {
              let _filename = hasExtension(_options.filename) ? pathBasename(_options.filename) : _options.filename;
              if (_filename.length) {
                destinationFilepaths[index] = `${path.join(path.dirname(destinationFilepaths[index]), _filename)}${path.extname(destinationFilepaths[index])}`
              }
            }
    
            // let us remove the local config from the content.
            delete _jsObject._jsonToScss;
          }
  
          // if no prefix is specified, set it using the destination filename as sass
          // variable name.
          if ('' === _options.prefix) {
            _options.prefix = `$${pathBasename(destinationFilepaths[index])}: `;
          }
  
          // let's restore the saved format in case it was changed locally.
          _options.format = _format;
  
          // if sass format is required then disable the sass content indentation
          // and if the suffix is ";" then remove it.
          if ('.sass' === _options.format) {
            _options.indentationSize = 0;
            if (_options.suffix.trim().startsWith(';')) {
              _options.suffix = '';
            }
          }
  
          // let's see if the --no-underscore option was set and if so, then while
          // the prefix starts with "$_" let's remove the "_".
          if (_options.noUnderscore) {
            while (_options.prefix.startsWith('$_')) {
              _options.prefix = `$${_options.prefix.slice(2)}`;
            }
          }
  
          // convert the js object into a sass string.
          const _sassString = `${jsValueToSassString(_jsObject, _options)}`;
          terminal(`${emoji.get('hourglass_flowing_sand')} ${chalk.blue(filepath)}: content converted.`);
          if (0 === Object.keys(_jsObject).length) {
            terminal(`${emoji.get('-1')} ${chalk.blue(filepath)}: no convertible content found. ${chalk.yellow('File skipped!')}\n`);
          }
          else {
            try {
              // ensure that the destination directory(ies) exist and if not create
              // it.
              createPathDirectories(destinationFilepaths[index]);
      
              // let's write the file.
              fs.writeFileSync(destinationFilepaths[index], `${_options.prefix}${_sassString}${_options.suffix}\n`);
      
              terminal(`${emoji.get('hourglass')} ${chalk.blue(filepath)}: content converted. ${chalk.green('File created!')}\n`);
              terminal(`   ${emoji.get('+1')} ${chalk.green(destinationFilepaths[index])}\n`);
            }
            catch (error) {
              terminal(`${emoji.get('-1')} ${chalk.blue(filepath)}: Oops! Something went wrong when trying to write the converted file. ${chalk.yellow('File skipped!')}\n`);
            }
          }
        }
      }
    }
  );
}


/**
 * Module exports.
 */
module.exports = jsJsonFilesToSassScssFiles;