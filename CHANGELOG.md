# CHANGE LOG

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
