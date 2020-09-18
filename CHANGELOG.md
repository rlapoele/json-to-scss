# CHANGE LOG

### Release 1.6.2
- Fixed bug occurring when more than 2 files are being merged and the merge object option (--mo) is activated.
  - see https://github.com/rlapoele/json-to-scss/issues/10
  
### Release 1.6.1
- Fixed typos in CLI (json-to-scss) help text & README.md

### Release 1.6.0
- New Features:
  - added option allowing users to obtain a list of sass/scss variables obtained from a flattened JSON/js object.
    - flattened keys can either be in kebab-case (default) or camel-case.
    - when flattening with kebab-case, json-to-scss does currently not change the nested key case.
    - when flattening with came-case, json-to-scss does currently only uppercase the first letter of the nested keys.

### Release 1.5.0
- New Feature:
  - added option (i.e. --sk='font-family') allowing users to force matching JSON/js object key values to be quoted.

### Release 1.4.0
- Upgraded dependencies.
- New Features:
  - added option allowing users to ask for converted Sass map keys to be wrapped in single or double quote characters.
  - added option allowing users to ask for converted Sass map values (other than nested maps) to be wrapped in single or double quote characters. 

### Release 1.3.1
- README.md typo fixes for example 5.2.
- command line output format updates for merge object scenario.

### Release 1.3.0
- New Feature:
  - added possibility to merge multiple converted sources into one single destination file.
    - in this context, the prefix & suffix are repeated for each converted source content;
      - the destination file therefore contains as many prefixed & suffixed block as there are sources.
      - if no prefix is specified then each source file name becomes a prefix ($source-file-name: ...).
    - by default, each converted source becomes a distinct/separated sass variable in the destination file.
  - when merging multiple source files, added possibility to merge content as well using global option "--mo" (merge object);
    - in this context, the prefix & suffix are only used once in the destination file and each individual converted block are comma+linefeed separated.  
- Code modifications:
  - further simplified code when possible (remove levels of nested internal function declarations).
  - updated object property existence checks such as "if (property.object)..." and used "'property' in object ..." expressions instead.
  - converted all switch statements into function + literal object declarations.

### Release 1.2.4
- Code modifications
  - simplified code by removing all options & config objects as well unnecessary validations.
  - Remove TextIndentation.js file/function (use String.prototype.repeat(...) directly instead).

### Release 1.2.3
- Code cleanups & comments addition.

### Release 1.2.2
- Code Fixes:
  - changed jsJsonFilesToSassScssFiles default config to ensure fn input validation flag is set to true by default.
  - updated cli.js to handle above change.
  - fixed typo in jsJsonFilesToSassScssFiles.js input validation (sourceFilepaths arg was checked 2 times instead of sourceFilepaths check + destinationFilepaths check.)
- Enhancements:  
  - re-organized jsJsonFilesToSassScssFiles code to be more functional.

### Release 1.2.1
- Documentation updates.
- Enhancements:
  - improved function input param validation
  - leveraged const default config.

### Release 1.2.0
- New Feature:
  - expanded definition of .js/.json self config ('_jsonToScssConfig') to add a new 'filename' property.
    - this allows users to define custom destination file name directly within the .js/.json file(s) they want to convert to sass or scss.
- Enhancements:
  - Added error message when specified source is invalid. This prevents situation when source is invalid and app appears to react as if nothing happened.
- Updates:
  - remove jsdoc docs - users can still generate it from their side if interested.
  - added an Examples folder with 4 examples.
  - added explanations and examples to README.md. 

### Release 1.1.1
- Added code documentation & generated it with _jsdoc_ in the `docs` folder.

### Release 1.1.0
- New Features:
  - auto-detection of a '_jsonToScssConfig' property within .js/.json files:
    - this allows users to define a local configuration for individual .js/.json files; when detected this _local_ config (options) takes precedence over the command line options.
  - new CLI option '**--no-underscore**' allowing users to tell _json-to-scss_ to remove any leading `_` (underscore) character from the prefix when the later corresponds to a sass variable.
- Fixes/Enhancements
  - added missing support for empty string setup options.
  - wrapped "require(content.js/.json) ..." code portion in try / catch to improve code robustness.
  - removed what seems to be an unnecessary json to string & string to json conversion.
- Updates
  - README.md updates to reflect the updated usage and so on.

### Release 1.0.2
- Fixes
  - swapped package.json "bin" & "main" values.
  - added a missing CHANGELOG.md file.

### Release 1.0.1
- Cleanups
  - removed experimental index.js.
