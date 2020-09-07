# JSON-TO-SCSS
<p>
  <a href="https://npmcharts.com/compare/json-to-scss?minimal=true"><img src="https://img.shields.io/npm/dm/json-to-scss.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/json-to-scss"><img src="https://img.shields.io/npm/v/json-to-scss.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/json-to-scss"><img src="https://img.shields.io/npm/l/json-to-scss.svg" alt="License"></a>
</p>

> Convert your js & json files to sass or scss files.

A small utility to convert js & json file(s) to scss/sass file(s).

## Motivation
This library has initially been created to contribute to & facilitate the maintenance of living style guides.

As far as living style guides go, defining and using an agreed upon a set of design properties is a good starting point and best practice (c.f. [_design tokens_](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71), [_Salesforce Lightning Design System_](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/tokens_intro.htm), etc... ).

While many file formats can be used (YAML, TOML, etc...) to store such properties, it is very easy to use javascript or json files.

Now, defining & storing design properties in one place is one thing but it is obviously useless if it cannot be easily consumed.

Developers will find it convenient to work with .js or .json file but what about others and, for example, people interested in leveraging such props in SASS for instance?

This is where _json-to-scss_ comes into play; this is obviously not the first (nor last) conversion tool (see below) but this is mine and I hope that you will find it useful. :)
  
[Andrew Clark](https://github.com/acdlite)'s [json-sass](https://github.com/acdlite/json-sass) library has been a significant source of inspiration for this version. Feel free to check-it out.


## Installation
To use _json-to-scss_ as development dependency with...

#### Yarn
```shell
yarn add -D json-to-scss
```

#### Npm
```shell
npm install json-to-scss --save-dev
```

## Usage
```
Usage: json-to-scss <source> [destination] [options]

       source:           the path to a javascript, json or group of files to be converted.
       (required)        - only '.js' and '.json' are processed.
       
       destination:      the full or partial destination of the converted files.
       (optional)        - when the destination is a directory path only, all generated
                           files are saved in it with a default '.scss' extension. If
                           a '.sass' extension is required instead, the --sass option must be included.

                   
       options:
       
        --h              (help)           Show this message.
        --p='prefix'     (prefix)         Prepend the converted sass/scss content with the prefix.
                                          Prefix is usually used & set to be used as sass variable name.
                                          Default '${source-filename} :'.
        --no-underscore  (no leading _)   Remove any leading '_' (underscore) characters from the
                                          prefix when used as sass variable name.
        --s='suffix'     (suffix)         Append the converted sass/scss content with the suffix.
                                          Default: ';' (default not used if --sass)
        --tt='tabText'   (tab text)       Text to be used to indent or tabulate sass map.
                                          Default: '  ' (two space characters)
        --tn=tabNumber   (tab number)     Number of tabulations.
                                          Default: 1 (set to 0 if --sass)
        --es='sq'||'dq'  (empty string)   Sass/scss representation for an empty string (single or double quote).
                                          Default is '""': { "prop": "" } => $xyzfilename: ( prop: "" );
        --sass           (sass ext.)      Use sass extension.
        --mo             (merge objects)  Merge obtained sass strings into a single sass map/list.
                                          Enabled only if destination contains a full file name (name + .ext)
        --k='auto'||     (sass map keys)  Sass/scss format for map keys.
            'sq'||'dq'                    'auto' (default): keys are formatted as per their converted type (number, ...)
                                          'sq': all keys are single quoted.
                                          'dq': all keys are doubled quoted.
        --v='auto'||     (sass map val.)  Sass/scss format for map values other than nested maps.
            'sq'||'dq'                    'auto' (default): values are formatted as per their converted type
                                          'sq': all values are single quoted.
                                          'dq': all values are doubled quoted.
                                          Notes regarding 'sq' or 'dq' usage:
                                          1- nested quote characters are automatically replaced by their counterpart.
                                             { "prop": "Arial, 'sans-serif'"} with 'sq' => ( prop: 'Arial, "sans-serif"' );
                                          2- empty strings are formatted as per the given 'sq' or 'dq' option value regardless
                                             of the --es option.
        --sk='family,..' (string keys)    Comma separated property names (keys) for which values must be quoted.
                                          Property names are case insensitive (fontFamily will be treated like FontFamily, etc...).
                                          Only non-object value keys are compared against the "string keys":
                                             { "key 1": { "key 2": "some,possible,values" }} => only "key 2" will be considered.
                                          Default "string keys" (property names) are:
                                             family,font-family,fontfamily,stack,font-stack,fontstack,face,font-face,fontface
                                          Turn this option off by setting it to '' (e.g. --sk='').
        --fk             (flatten keys)   Flatten JSON/js object keys to produce series of sass/scss variables instead of a map.
                                          Provided prefix and suffix, if any, are applied to each flatten key.
                                          Key name elements (nested JSON object props) are dash separated (kebab-case).
                                          In case of flatten key name conflict(s), the latest processed key value is used.
                                          This option is not available in the js/JSON embed-able config.
        --fkc='kebab'||  (flat. key case) Flattened key case.
              'camel'                    'kebab' (default): nested keys are dash separated. No letter case change.
                                         'camel': top level keys are left as-is whereas nested keys are capitalized before
                                             being concatenated. The nested key capitalization does not change the case of the
                                             subsequent letters: 'hEllO' => 'HEllO'.


```

## Regarding `.js` files

_json-to-scss_ can convert `.js` files as long as these are a nodejs modules exporting a **javascript object**.

#### Javascript (node module) file sample

```js
const colorRed = "#FF0000";
const colorBlue = "#0099FF";

module.exports = {
  colors: {
    red: colorRed,
    green: "#00FF00",
    blue: colorBlue
  }
}
```

## Examples

#### Example #1

This example shows how to convert a single specific file using the default _json-to-scss_ options and storing the converted file in the same source directory.

##### Directory Structure:

```
.
├─ Examples
│   ├─ Example1
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           └─ myTokens.json
.   .
```

##### myTokens.json

```json
{
  "colors": {
    "primary-color": "#FFFFFF",
    "accent-color": "#0099FF"
  },
  "font-sizes": {
    "small": ".875rem",
    "medium": "1rem",
    "large": "2rem"
  },
  "font-family": {
    "sans-serif": "'Roboto, Helvetica, Arial, sans-serif'"
  },
  "web-browser-default-font-size": "16px"
}
```

Note: values corresponding to sass/scss list and which you cannot or do not want to store as an array in your JSON should be quoted such as "'my, list, of, values'".

##### Command:

```
$ json-to-scss ./Examples/Example1/ProjectDir/tokens/myTokens.json
$ json-to-scss vX.Y.Z
$    /.../Examples/Example1/ProjectDir/tokens/myTokens.json: content converted. File created!
$       /.../Examples/Example1/ProjectDir/tokens/myTokens.scss
```

##### Results:

###### Directory Structure:

```
.
├─ Examples
│   ├─ Example1
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           ├─ myTokens.json
│   │           └─ myTokens.scss 
.   .
```

###### myTokens.scss

```scss
$myTokens: (
  colors: (
    primary-color: #FFFFFF,
    accent-color: #0099FF
  ),
  font-sizes: (
    small: .875rem,
    medium: 1rem,
    large: 2rem
  ),
  font-family: (
    sans-serif: 'Roboto, Helvetica, Arial, sans-serif'
  ),
  web-browser-default-font-size: 16px
);
```

#### Example #2
In this example, we will demonstrate _json-to-scss_ ability to accept glob patterns.

Note that when using a glob pattern, the source argument must be wrapped in single quotes such as `'...**/*.*'`.

##### Directory Structure:

```
.
├─ Examples
│   ├─ Example2
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           └─ fontSizes.js
.   .
```

##### colors.js
```js
module.exports = {
  colors: {
    "primary-color": "#FFFFFF",
    "accent-color": "#0099FF"
  }
};
```

##### fontSizes.json
```json
{
  "font-sizes": {
    "small": ".875rem",
    "medium": "1rem",
    "large": "2rem"
  },
  "web-browser-default-font-size": "16px"
}
```

##### Command:

```
$ json-to-scss './Examples/Example2/**/*.*'
$ json-to-scss vX.Y.Z
$    /.../Examples/Example2/ProjectDir/tokens/colors.js: content converted. File created!
$       /.../Examples/Example2/ProjectDir/tokens/colors.scss
$    /.../Examples/Example2/ProjectDir/tokens/fontSizes.json: content converted. File created!
$       /.../Examples/Example2/ProjectDir/tokens/fontSizes.scss
```

##### Results:

###### Directory Structure:

```
.
├─ Examples
│   ├─ Example2
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           ├─ colors.js
│   │           ├─ fontSizes.json
│   │           └─ fontSizes.scss 
.   .
```

###### colors.scss

```scss
$colors: (
  colors: (
    primary-color: #FFFFFF,
    accent-color: #0099FF
  )
);
```


###### fontSizes.scss

```scss
$fontSizes: (
  font-sizes: (
    small: .875rem,
    medium: 1rem,
    large: 2rem
  ),
  web-browser-default-font-size: 16px
);
```

#### Example #3
This example will target a similar directory source structure & the same set of files however, this time, we will specify a `sass` target directory for the converted files and request _json-to-scss_ to format the output in `sass` format.

Additionally, we will ask _json-to-scss_ to use a tab text (_--tt option_) such as `'    '` (4 spaces) and to use a tab number/size (_--tn option_) of `5`...

##### Directory Structure:

```
.
├─ Examples
│   ├─ Example3
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           └─ fontSizes.js
.   .
```

##### Command:

```
$ json-to-scss './Examples/Example3/**/*.*' ./Examples/Example3/ProjectDir/sass --sass --tt='    ' --tn=5
$ json-to-scss vX.Y.Z
$    /.../Examples/Example3/ProjectDir/tokens/colors.js: content converted. File created!
$       /.../Examples/Example3/ProjectDir/sass/colors.sass
$    /.../Examples/Example3/ProjectDir/tokens/fontSizes.json: content converted. File created!
$       /.../Examples/Example3/ProjectDir/sass/fontSizes.sass
```

##### Results:

###### Directory Structure:

```
.
├─ Examples
│   ├─ Example3
│   │   └─ ProjectDir
│   │       ├─ sass 
│   │       │    ├─ colors.sass
│   │       │    └─ fontSizes.sass
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           └─ fontSizes.js
.   .
```


###### /sass/colors.sass

```sass
$colors: (colors: (primary-color: #FFFFFF, accent-color: #0099FF)) 
```

###### /sass/fontSizes.sass

```sass
$fontSizes: (font-sizes: (small: .875rem, medium: 1rem, large: 2rem), web-browser-default-font-size: 16px)
```

As you can notice in the produced sass content presented above, the options related to the text indentation (_--tt_ and _--tn_) have both been ignored and, since we asked to produce sass here, the default indentation has even been removed.

#### Example #4

For this example, we'll reuse the same directory structure as in the first example.

However this time, we will include a local conversion configuration directly within the json file that we want to convert.

As you will see, this local config will overwrite/supersede the default & command line (through options) configs.

##### Directory Structure:

```
.
├─ Examples
│   ├─ Example4
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           └─ myTokens.json
.   .
```

##### myTokens.json:

```json
{
  "_jsonToScss": {
    "sassVariableName": "__example-4",
    "filename": "myTokensRenamed",
    "prefix": "garbage",
    "suffix": "; // an scss comment.",
    "emptyString": "''",
    "indentationText": "  ",
    "indentationSize": 2,
    "noUnderscore": true,
    "keyFormat": "dq",
    "valueFormat": "auto"
  },
  "colors": {
    "primary-color": "#FFFFFF",
    "accent-color": "#0099FF"
  },
  "font-sizes": {
    "small": ".875rem",
    "medium": "1rem",
    "large": "2rem"
    
  },
  "example-of-empty-string": "",
  "web-browser-default-font-size": "16px"
}
```

Notice the **`"_jsonToScss"`** property & object in our `myTokens.json` file.

This object is treated as a local conversion configuration; let us see what properties it contains:

- **sassVariableName**
  - this tells _json-to-scss_ to prefix the converted content using `__example-4`. Notice here that you do not need to include the `$` character since _json-to-scss_ will automatically insert it for you.
  
  - **notes:**
    - this feature only exists in the context of local config and there is therefore no direct equivalent option at the command line level; the command line option which could potentially yield similar results is `--prefix`.
    - when specified, the `"sassVariableName"` property value takes precedence over the `"prefix"` property value (and therefore equivalent command line option `--prefix`).

- **filename**
  - this informs _json-to-scss_ that the destination file will have to be renamed ("myTokensRenamed" in this example); any specified extension will be ignored. 

- **prefix**
  - allows one to define or locally override the content prefix. In this example, the "garbage" value will be ignored due to the definition of **sassVariableName** in the same local configuration.

- **suffix**
  - allows one to define or locally override the content suffix. In this example, "; // an scss comment." will be appended to "myTokens.json" converted content.  

- **emptyString**
  - tells _json-to-scss_ how to format sass values equal to empty strings. By default and here too, empty string values are represented as `''` (two single quotes)

- **indentationText**
  - specifies the portion of text to be used as indentation "space". Here, `"  "` (two white spaces) is set as the indentation text.
  
- **indentationSize**
  - indicates the number of indentation "space"(s) which must be used when indenting content; in our example, since the value is 2, it will indent nested sass maps/values with 2 "space" text chunks per indentation level.

- **noUnderscore**
  - when set to `true` (as it is the case in our example), this tells _json-to-scss_ to remove any `_` (underscore) character possibly present in the prefix and if such a prefix starts with `$_`. The same result can be achieved for all converted files using the command line option "--no-underscore".

- **keyFormat**
  - allows one to force sass map keys to be wrapped (or not - use "auto") in single (use "sq") or double quote (use "dq").

- **valueFormat**
  - allows one to force sass map values to be wrapped (or not - use "auto") in single (use "sq") or double quote (use "dq"). 

##### Command:

```
$ json-to-scss ./Examples/Example4/ProjectDir/tokens/myTokens.json
$ json-to-scss vX.Y.Z
$    /.../Examples/Example4/ProjectDir/tokens/myTokens.json: content converted. File created!
$       /.../Examples/Example4/ProjectDir/tokens/myTokensRenamed.scss
```

##### Results:

###### Directory Structure:

```
.
├─ Examples
│   ├─ Example4
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           ├─ myTokens.json
│   │           └─ myTokensRenamed.scss 
.   .
```

Notice now how "myTokens" got renamed "myTokensRenamed".


###### myTokensRenamed.scss:

```scss
$example-4: (
    "colors": (
        "primary-color": #FFFFFF,
        "accent-color": #0099FF
    ),
    "font-sizes": (
        "small": .875rem,
        "medium": 1rem,
        "large": 2rem
    ),
    "example-of-empty-string": '',
    "web-browser-default-font-size": 16px
); // an scss comment.
```

As expected, the `"_scssToJson"` local configuration property/object has been removed and the converted content has been prefixed using "__example-4".

Additionally and due to the presence of `"noUnderscore": true`, all "`_`" (underscore) characters have been stripped out from the prefix/variable name after the automatically added "`$`" (dollar sign).

#### Example #5

This example illustrates 2 merge features (new as of v1.3.0).

**Example #3**'s directory structure and source files are used.

##### #5.1 - Merging of several source files into 1 destination file:

In order to merge the converted content of several source files, one must specify a destination including a file name + extension (.sass or .scss).

The destination file extension is important here as this is thanks to it that _json-to-scss_ can detect the merge request...

###### Directory Structure:

```
.
├─ Examples
│   ├─ Example5
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           └─ fontSizes.js
.   .
```


###### Command

```
$ json-to-scss './Examples/Example5/ProjectDir/tokens/*.*' ./Examples/Example5/ProjectDir/scss/mergedTokenFiles.scss
$ json-to-scss vX.Y.Z
$    /.../Examples/Example5/ProjectDir/tokens/colors.js: content converted.
$    /.../Examples/Example5/ProjectDir/tokens/fontSizes.json: content converted. File created!
$       /.../Examples/Example5/ProjectDir/scss/mergedTokenFiles.scss
```

###### Output

###### _Directory Structure:_

```
.
├─ Examples
│   ├─ Example5
│   │   └─ ProjectDir
│   │       ├─ scss 
│   │       │   └─ mergedTokenFiles.scss
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           └─ fontSizes.js
.   .
```

###### _mergedTokenFiles.scss:_
```scss
$colors: (
  colors: (
    primary-color: #FFFFFF,
    accent-color: #0099FF
  )
);
$fontSizes: (
  font-sizes: (
    small: .875rem,
    medium: 1rem,
    large: 2rem
  ),
  web-browser-default-font-size: 16px
);
```


##### #5.2 - Merging of several source files AND of the converted content into 1 sass map/block.

Note that in addition to specifying one specific destination file, we are using the `--mo` command line option here to tell _json-to-scss_ to also merge sass objects.

###### Directory Structure:

```
.
├─ Examples
│   ├─ Example5
│   │   └─ ProjectDir
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           └─ fontSizes.js
.   .
```

###### Command:

```
$ json-to-scss './Examples/Example5/ProjectDir/tokens/*.*' ./Examples/Example5/ProjectDir/scss/mergedTokenFilesAndObjects.scss --mo
$ json-to-scss vX.Y.Z
$    /.../Examples/Example5/ProjectDir/tokens/colors.js: content converted.
$    /.../Examples/Example5/ProjectDir/tokens/fontSizes.json: content converted & merged. File created!
$       /.../Examples/Example5/ProjectDir/scss/mergedTokenFilesAndObjects.scss
```

###### Output:

###### _Directory Structure:_

```
.
├─ Examples
│   ├─ Example5
│   │   └─ ProjectDir
│   │       ├─ scss 
│   │       │   └─ mergedTokenFilesAndObjects.scss
│   │       └─ tokens 
│   │           ├─ colors.js
│   │           └─ fontSizes.js
.   .
```

###### _mergedTokenFilesAndObjects.scss_

```scss
$mergedTokenFilesAndObjects: (
  colors: (
    primary-color: #FFFFFF,
    accent-color: #0099FF
  ),
  font-sizes: (
    small: .875rem,
    medium: 1rem,
    large: 2rem
  ),
  web-browser-default-font-size: 16px
);
```
