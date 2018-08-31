# CHANGE LOG

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
