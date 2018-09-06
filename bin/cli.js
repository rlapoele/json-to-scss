#!/usr/bin/env node
'use strict';
/**
 * JSON-TO-SCSS Command Line Interface.
 * @author Renaud Lapoële
 */

/**
 * Module dependencies.
 */
const path = require('path');
const packageJson = require(path.join(__dirname, '../package.json'));
const args = require('yargs').argv;
const chalk = require('chalk');
const glob = require('glob');
const pathBasename = require('../lib/utils/path/basename');
const removePathExtension = require('../lib/utils/path/removeExtension');
const jsJsonFilesToSassScssFiles = require('../lib/jsJsonFilesToSassScssFiles');

/**
 * @function banner
 * @param {string} name - the name of the package the banner is getting built for.
 * @param {string} version - the version number of the package the banner is getting built for.
 * @returns {string} this lib/package's name & version.
 * @description Returns a string containing the name and the version of this lib/package.
 */
function banner(name, version) {
  return `${chalk.bold(`${name || 'NO NAME'} v${version || '0.0.0'}`)}`;
}

/**
 * @function usage
 * @param {string} name - the name of the package usage instructions are generated for.
 * @returns {string} the lib/package's usage text.
 * @description Returns the usage description of this lib/package.
 */
function usage(name) {
  return `
    ${chalk.bold('Usage')}: ${chalk.yellow(
    name || 'NO NAME'
  )} <source> [destination] [options]
    
           ${chalk.bold(
             'source'
           )}:           the path to a javascript, json or group of files to be converted.
           (required)        - only '.js' and '.json' are processed.
           
           ${chalk.bold(
             'destination'
           )}:      the full or partial destination of the converted files.
           (optional)        - when the destination is a directory path only, all generated
                               files are saved in it with a default '.scss' extension. If
                               a '.sass' extension is required instead, the --sass option must be included.
    
                       
           ${chalk.bold('options')}:
           
            --h              (help)           Show this message.
            --p='prefix'     (prefix)         Prepend the converted sass/scss content with the prefix.
                                              Prefix is usually used & set to be used as sass variable name.
                                              Default '\${source-filename} :'.
            --no-underscore  (no leading _)   Remove any leading '_' (underscore) characters from the
                                              prefix when used as sass variable name.
            --s='suffix'     (suffix)         Append the converted sass/scss content with the suffix.
                                              Default: ';' (default not used if --sass)
            --tt='tabText'   (tab text)       Text to be used to indent or tabulate sass map.
                                              Default: '  ' (two space characters)
            --tn=tabNumber   (tab number)     Number of tabulations.
                                              Default: 1 (set to 0 if --sass)
            --es='sq'||'dq'  (empty string)   Sass/scss representation for an empty string.
                                              Default is '""': { "prop": "" } => $xyzfilename: ( prop: "" );
            --sass           (sass ext.)      Use sass extension.
            --mo             (merge objects)  Merge obtained sass strings into a single sass map/list.
                                              Enabled only if destination contains a full file name (name + .ext)

                                          
`;
}

/**
 * @function hasArgs
 * @param {object} args - command line arguments extracted via/from/with yargs.
 * @returns {boolean} true if args has an "_" property and if this property has a length property different than 0.
 * @description This is an internal small helper function to quickly assess if 'json-to-scss' is called without any params. Note that the code written here relies on the fact that we are using the 'yargs' package.
 */
function hasArgs(args) {
  return '_' in args && args._.length;
}

/**
 * @function extensionCorrector
 * @param {string} defaultExtension - the destination file extension to be used by default.
 * @param {string} requiredExtension - the destination file extension which must be used.
 * @returns {Function} a function to be used as input for an Array.map(fn) function call.
 * @description Internal helper function encapsulating the destination file extension transformations.
 */
function extensionCorrector(defaultExtension, requiredExtension) {
  return filepath => {
    function _correctFilepathExtension(extensionName) {
      let _switch = {
        '': () =>
          `${filepath}${
            '' !== requiredExtension ? requiredExtension : defaultExtension
          }`,
        '.scss': () =>
          '' === requiredExtension || requiredExtension === extensionName
            ? filepath
            : `${removePathExtension(filepath)}${requiredExtension}`,
        '.sass': () =>
          '' === requiredExtension || requiredExtension === extensionName
            ? filepath
            : `${removePathExtension(filepath)}${requiredExtension}`,
        default: () =>
          `${removePathExtension(filepath)}${
            '' !== requiredExtension ? requiredExtension : defaultExtension
          }`
      };
      return (_switch[extensionName] || _switch['default'])();
    }

    return _correctFilepathExtension(path.extname(filepath).toLowerCase());
  };
}

/**
 * @function basenameExtractor
 * @param {string} filepath - the file path from which we want to extract the basename.
 * @returns {string} the file path basename.
 * @description Internal helper & wrapper function extracting the file path's base name.
 */
function basenameExtractor(filepath) {
  return pathBasename(filepath);
}

/**
 * @function dirnameSetter
 * @param {string} dirname - the directory name we want to use for our destination file paths.
 * @returns {function} a function to be used as input for an Array.map(fn) function call.
 * @description set the directory(ies) for the given destination file path.
 */
function dirnameSetter(dirname) {
  return filepath => path.resolve(path.join(dirname, filepath));
}

/**
 * @function normalizeArgs
 * @param {object} args - command line program arguments (built by the yargs package) to be normalized.
 * @returns {{source: {paths: *}, destination: {paths: (*|Array)}, options: {prefix: string | string, suffix: (*|string), emptyString: string, indentationText: (*|string), indentationSize: (*|number), noUnderscore: boolean, format: string}}}
 * @description check & normalize the command line program arguments.
 */
function normalizeArgs(args) {
  const _source = path.resolve(process.cwd(), `${args._[0]}`);
  const _sourcePaths = glob.sync(_source);
  const _defaultExtension = '.scss';
  let _requiredExtension = 'sass' in args ? '.sass' : '';

  const _destination =
    args._.length > 1 ? path.resolve(process.cwd(), `${args._[1]}`) : '';
  const _destinationExtname = path.extname(_destination).toLowerCase();

  let _destinationPaths = [];
  if ('' === _destination) {
    _destinationPaths = _sourcePaths.map(
      extensionCorrector(_defaultExtension, _requiredExtension)
    );
  } else {
    if ('' !== _destinationExtname) {
      if ('.sass' === _destinationExtname || '.scss' === _destinationExtname) {
        _requiredExtension = _destinationExtname;
        _destinationPaths = [_destination];
      } else {
        _destinationPaths = [removePathExtension(_destination)].map(
          extensionCorrector(_defaultExtension, _requiredExtension)
        );
      }
    } else {
      _destinationPaths = _sourcePaths
        .map(basenameExtractor)
        .map(extensionCorrector(_defaultExtension, _requiredExtension))
        .map(dirnameSetter(_destination));
    }
  }
  const _mergeSourceFiles =
    _sourcePaths.length > 1 && _sourcePaths.length !== _destinationPaths.length;

  return {
    source: {
      paths: _sourcePaths
    },
    destination: {
      paths: _destinationPaths
    },
    options: {
      prefix: 'p' in args ? args.p : '',
      suffix: 's' in args ? args.s : ';',
      emptyString: 'es' in args && 'sq' === args.es ? "''" : '""',
      indentationText: 'tt' in args ? args.tt : '  ',
      indentationSize: 'tn' in args ? args.tn : 1,
      noUnderscore: !('underscore' in args),
      format:
        '' === _requiredExtension ? _defaultExtension : _requiredExtension,
      mergeSourceFiles: _mergeSourceFiles,
      mergeSassObjects: _mergeSourceFiles && 'mo' in args
    }
  };
}

/**
 * The 'json-to-scss' main function in charge of parsing arguments and, if possible,
 * executing the file conversion.
 */
function main() {
  console.log(banner(packageJson.name, packageJson.version));
  if (hasArgs(args)) {
    if ('h' in args) {
      console.log(usage(packageJson.name));
    } else {
      const _nargs = normalizeArgs(args);
      if (_nargs.source.paths.length) {
        jsJsonFilesToSassScssFiles(
          _nargs.source.paths,
          _nargs.destination.paths,
          _nargs.options.prefix,
          _nargs.options.suffix,
          _nargs.options.format,
          _nargs.options.indentationText,
          _nargs.options.indentationSize,
          _nargs.options.emptyString,
          _nargs.options.noUnderscore,
          _nargs.options.mergeSourceFiles,
          _nargs.options.mergeSassObjects
        );
      } else {
        console.log(
          `Hmmm strange... ${chalk.red(
            args._[0]
          )} cannot be found. Could there be a small mistake in the source path?`
        );
      }
    }
  } else {
    console.log(usage(packageJson.name));
  }
}

/**
 * Execute the main module function.
 */
main();
