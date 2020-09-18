'use strict';
/**
 * @module json-to-scss/lib/jsJsonFilesToSassScssFiles
 * @author Renaud Lapoële
 */

/**
 * Modules imports/dependencies.
 */
const fs = require('fs');
const path = require('path');
const terminal = require('terminal-overwrite');
const emoji = require('node-emoji');
const chalk = require('chalk');
const pathBasename = require('../lib/utils/path/basename');
const hasExtension = require('../lib/utils/path/hasExtension');
const createPathDirectories = require('../lib/utils/path/createPathDirectories');
const isBoolean = require('../lib/utils/inspection/isBoolean');
const isPositiveInteger = require('../lib/utils/inspection/isPositiveInteger');
const isString = require('../lib/utils/inspection/isString');
const jsValueToSassString = require('../lib/jsValueToSassString');
const flattenObject = require('../lib/utils/transformation/flattenObject');

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
 * @param {boolean} mergeSourceFiles
 * @param {boolean} mergeSassObjects
 * @param {string} keyFormat - 'auto', 'sq' or 'dq'
 * @param {string} valueFormat - 'auto', 'sq' or 'dq'
 * @param {string} stringKeys
 * @param {boolean} flattenKeys
 * @param {string} flattenedKeyCase
 * @description Converts node js (.js files exporting an object...) & json files to sass or scss files.
 */
function jsJsonFilesToSassScssFiles(
  sourceFilepaths,
  destinationFilepaths,
  prefix,
  suffix,
  format,
  indentationText,
  indentationSize,
  emptyString,
  noUnderscore,
  mergeSourceFiles,
  mergeSassObjects,
  keyFormat,
  valueFormat,
  stringKeys,
  flattenKeys,
  flattenedKeyCase
) {
  let mergedSassStrings = '';

  /**
   * @private
   * @function _convertFile
   * @param {string} filepath
   * @param {number} fileindex
   * @description loads, converts and potentially (no merge context) saves converted content into a file.
   */
  function _convertFile(filepath, fileindex) {
    terminal(`${emoji.get('gear')} ${chalk.blue(filepath)}:`);
    const _filepathExtension = path.extname(filepath);

    // skip any files if extension is <> than ".js" or ".json".
    if (-1 === ['.js', '.json'].indexOf(_filepathExtension)) {
      terminal(
        `${emoji.get('x')}  ${chalk.blue(
          filepath
        )}: unsupported file format: "${_filepathExtension}". ${chalk.yellow(
          'File skipped!'
        )}\n`
      );
    } else {
      let _prefix = prefix;
      let _suffix = suffix;
      let _indentationText = indentationText;
      let _indentationSize = indentationSize;
      let _emptyString = emptyString;
      let _noUnderscore = noUnderscore;
      let _destinationFilepath = mergeSourceFiles
        ? destinationFilepaths[0]
        : destinationFilepaths[fileindex];
      let _destinationFilename = '';
      let _keyFormat = keyFormat;
      let _valueFormat = valueFormat;
      let _stringKeys = stringKeys.split(',').map((v) => v.trim().toUpperCase());
      let _flattenKeys = flattenKeys;
      let _jsObject = {};
      let _errorFlag = false;

      // let's try to "import" the source file.
      try {
        _jsObject = require(filepath);
      } catch (error) {
        // Oops - something went wrong (most likely a JSON format error).
        terminal(
          `${emoji.get('-1')} ${chalk.blue(
            filepath
          )}: error(s) found while parsing; content skipped. ${chalk.yellow(
            'File skipped!'
          )}\n`
        );
        _errorFlag = true;
      }

      // verify that no error occurred previously and if it did, then skip the
      // rest of the process for the concerned file.
      if (!_errorFlag) {
        // let's check if the source content has a local config (option set)
        // defined.
        if ('_jsonToScss' in _jsObject) {
          const { _jsonToScss } = _jsObject;

          // if yes, then use its content:
          // get prefix if there is one defined.
          if ('prefix' in _jsonToScss && isString(_jsonToScss.prefix)) {
            _prefix = _jsObject._jsonToScss.prefix;
          }

          // get suffix if one is specified.
          if ('suffix' in _jsonToScss && isString(_jsonToScss.suffix)) {
            _suffix = _jsObject._jsonToScss.suffix;
          }

          // if no merge && indentationText then grab it.
          if (
            !mergeSourceFiles &&
            'indentationText' in _jsonToScss &&
            isString(_jsonToScss.indentationText)
          ) {
            _indentationText = _jsObject._jsonToScss.indentationText;
          }

          // if no merge && indentationSize then grab it.
          if (
            !mergeSourceFiles &&
            'indentationSize' in _jsonToScss &&
            isPositiveInteger(_jsonToScss.indentationSize)
          ) {
            _indentationSize = _jsObject._jsonToScss.indentationSize;
          }

          // if no merge && emptyString then get it.
          if (
            !mergeSourceFiles &&
            'emptyString' in _jsonToScss &&
            ('""' === _jsonToScss.emptyString ||
              "''" === _jsonToScss.emptyString)
          ) {
            _emptyString = _jsObject._jsonToScss.emptyString;
          }

          // if noUnderscore, then use it.
          if (
            'noUnderscore' in _jsonToScss &&
            isBoolean(_jsonToScss.noUnderscore)
          ) {
            _noUnderscore = _jsObject._jsonToScss.noUnderscore;
          }
          
          // if sassVariableName, then grab it and reset prefix if no file merge.
          if (
            !mergeSourceFiles &&
            'sassVariableName' in _jsonToScss &&
            isString(_jsonToScss.sassVariableName) &&
            _jsonToScss.sassVariableName.length
          ) {
            _prefix = _flattenKeys
              ? `$${_jsonToScss.sassVariableName}`
              : `$${_jsonToScss.sassVariableName}: `;
          }
          
  
          // if no merge and good filename :) then prepare it and update the
          // "copy" of the original destination file path.
          if (
            !mergeSourceFiles &&
            'filename' in _jsonToScss &&
            isString(_jsonToScss.filename) &&
            _jsonToScss.filename.length
          ) {
            _destinationFilename = hasExtension(_jsonToScss.filename)
              ? pathBasename(_jsonToScss.filename)
              : _jsObject._jsonToScss.filename;

            if (_destinationFilename.length) {
              _destinationFilepath = `${path.join(
                path.dirname(_destinationFilepath),
                _destinationFilename
              )}${path.extname(_destinationFilepath)}`;
            }
          }
          
          // check if sass map keys formatting (wrapping in quotes) is required.
          if (
            'keyFormat' in _jsonToScss &&
             -1 !== ['auto','sq','dq'].indexOf(_jsonToScss.keyFormat)
          ) {
            _keyFormat = _jsonToScss.keyFormat;
          }
  
          // check if sass map values formatting (wrapping in quotes) is required.
          if (
            'valueFormat' in _jsonToScss &&
            -1 !== ['auto','sq','dq'].indexOf(_jsonToScss.valueFormat)
          ) {
            _valueFormat = _jsonToScss.valueFormat;
          }
          
          // check if some props must be treated as string forcefully.
          if (
            'stringKeys' in _jsonToScss &&
            isString(_jsonToScss.stringKeys)) {
            _stringKeys = _jsonToScss.stringKeys.split(',').map((v) => v.trim().toUpperCase())
          }
          
          // let us remove the local config from the content.
          delete _jsObject._jsonToScss;
        }

        // if no prefix is specified then set one using:
        //   - $ if flattenKeys option is on
        //   else
        //   - the source filename (as sass variable) if we are merging several
        //     sources into one destination.
        //   or at last
        //   - the destination filename otherwise.
        if ('' === _prefix) {
          _prefix =
            _flattenKeys
              ? '$'
              :  (mergeSourceFiles && mergeSassObjects) || !mergeSourceFiles
                 ? `$${pathBasename(_destinationFilepath)}: `
                 : `$${pathBasename(filepath)}: `;
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

        let _sassString = '';
        
        if (_flattenKeys && !!Object.keys(_jsObject).length) {
          // convert all nested objects into flat objects and convert the results
          // into a series of sass/scss variables.
          let _flattenObject = flattenObject(_jsObject, flattenedKeyCase);

          let count = 0;
          for (let _aJsObjectKey in _flattenObject) {
            let _newSassString = `${jsValueToSassString(
              _flattenObject[_aJsObjectKey],
              _indentationText,
              _indentationSize,
              _emptyString,
              _keyFormat,
              _valueFormat,
              _stringKeys
            )}`;
            
            _sassString = 0 === count
              ? `${_prefix}${_aJsObjectKey}: ${_newSassString}${_suffix}`
              : `${_sassString}\n${_prefix}${_aJsObjectKey}: ${_newSassString}${_suffix}`
            
            count++;
          }
          //if (0 < _sassString.length) {
          //  _sassString = `${_sassString}\n`;
          //}
        }
        else {
          // convert the js object into a sass string.
          _sassString = `${jsValueToSassString(
            _jsObject,
            _indentationText,
            _indentationSize,
            _emptyString,
            _keyFormat,
            _valueFormat,
            _stringKeys
          )}`;
        }
        
        terminal(
          `${emoji.get('hourglass_flowing_sand')} ${chalk.blue(
            filepath
          )}: content converted.`
        );
        if (0 === Object.keys(_jsObject).length) {
          terminal(
            `${emoji.get('-1')} ${chalk.blue(
              filepath
            )}: no convertible content found. ${chalk.yellow(
              'File skipped!'
            )}\n`
          );
        }
        else {
          if (!mergeSourceFiles) {
            try {
              // ensure that the destination directory(ies) exist and if not
              // create it.
              createPathDirectories(_destinationFilepath);

              // let's write the file.
              // Ignore prefix and suffix if js object has been flatten.
              fs.writeFileSync(
                _destinationFilepath,
                _flattenKeys ? `${_sassString}\n` : `${_prefix}${_sassString}${_suffix}\n`
              );

              terminal(
                `${emoji.get('hourglass')} ${chalk.blue(filepath)}: content converted. ${chalk.green('File created!')}\n`
              );
              terminal(
                `   ${emoji.get('+1')} ${chalk.green(_destinationFilepath)}\n`
              );
            } catch (error) {
              terminal(
                `${emoji.get('-1')} ${chalk.blue(
                  filepath
                )}: Oops! Something went wrong when trying to write the converted file. ${chalk.yellow(
                  'File skipped!'
                )}\n`
              );
            }
          }
          else {
            if (mergeSassObjects && !_flattenKeys) {
              // Objects coming from several files must be merged but not flattened.
              
              // First file to be processed?
              if (0 === fileindex) {
                // first file of many and sass value is map?
                if (
                  fileindex < sourceFilepaths.length - 1 &&
                  _sassString.endsWith('\n)')
                ) {
                  _sassString = _sassString.slice(0, -2);
                }
                mergedSassStrings = `${_prefix}${_sassString}`;
                terminal(
                  `${emoji.get('hourglass')} ${chalk.blue(
                    filepath
                  )}: content converted.\n`
                );
              }
              // Not the first file?
              if (
                0 < fileindex &&
                fileindex <= sourceFilepaths.length - 1
              ) {
                // is sass value map?
                if (_sassString.startsWith('(\n')) {
                  _sassString = _sassString.slice(2);
                }
                
                // is sass value map and file is not last?
                if (
                  fileindex < sourceFilepaths.length - 1 &&
                  _sassString.endsWith('\n)')
                ) {
                  _sassString = _sassString.slice(0, -2);
                }
                
                mergedSassStrings = `${mergedSassStrings},\n${_sassString}`;
                if (fileindex < sourceFilepaths.length - 1) {
                  terminal(
                    `${emoji.get('hourglass')} ${chalk.blue(
                      filepath
                    )}: content converted & merged.\n`
                  );
                } else {
                }
              }
              // Is file being processed the last?
              if (fileindex === sourceFilepaths.length - 1) {
                mergedSassStrings = `${mergedSassStrings}${_suffix}\n`;
                try {
                  // file being processed is the last one so now we can save the
                  // "merged" content.
                  createPathDirectories(_destinationFilepath);

                  // let's write the file.
                  fs.writeFileSync(_destinationFilepath, mergedSassStrings);

                  terminal(
                    `${emoji.get('hourglass')} ${chalk.blue(
                      filepath
                    )}: content converted & merged. ${chalk.green(
                      'File created!'
                    )}\n`
                  );
                  terminal(
                    `   ${emoji.get('+1')} ${chalk.green(
                      _destinationFilepath
                    )}\n`
                  );
                } catch (error) {
                  terminal(
                    `${emoji.get('-1')} ${chalk.blue(
                      filepath
                    )}: Oops! Something went wrong when trying to write the converted content file. ${chalk.yellow(
                      'File skipped!'
                    )}\n`
                  );
                }
              }
            }
            else {
              // merge scenario so append new converted content to the existing
              // one.
              mergedSassStrings = _flattenKeys
                ? `${mergedSassStrings}${_sassString}\n`
                : `${mergedSassStrings}${_prefix}${_sassString}${_suffix}\n`;

              // is the source file being processed the last one?
              // No, then let the user know that the source content was
              // converted but nothing more/else.
              if (fileindex < sourceFilepaths.length - 1) {
                terminal(
                  `${emoji.get('hourglass')} ${chalk.blue(
                    filepath
                  )}: content converted.\n`
                );
              }
              else {
                try {
                  // file being processed is the last one so now we can save the
                  // "merged" content.
                  createPathDirectories(_destinationFilepath);

                  // let's write the file.
                  fs.writeFileSync(_destinationFilepath, mergedSassStrings);

                  terminal(
                    `${emoji.get('hourglass')} ${chalk.blue(
                      filepath
                    )}: content converted. ${chalk.green('File created!')}\n`
                  );
                  terminal(
                    `   ${emoji.get('+1')} ${chalk.green(
                      _destinationFilepath
                    )}\n`
                  );
                } catch (error) {
                  terminal(
                    `${emoji.get('-1')} ${chalk.blue(
                      filepath
                    )}: Oops! Something went wrong when trying to write the converted content file. ${chalk.yellow(
                      'File skipped!'
                    )}\n`
                  );
                }
              }
            }
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
