# JSON-TO-SCSS
<p>
  <a href="https://npmcharts.com/compare/json-to-scss?minimal=true"><img src="https://img.shields.io/npm/dm/json-to-scss.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/json-to-scss"><img src="https://img.shields.io/npm/v/json-to-scss.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/json-to-scss"><img src="https://img.shields.io/npm/l/json-to-scss.svg" alt="License"></a>
</p>

> Convert your js & json files to sass or scss files.

A small utility to convert js & json file(s) to scss/sass file(s).

# Motivation
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
        --es='sq'||'dq'  (empty string)   Sass/scss representation for an empty string.
                                          Default is '""': { "prop": "" } => $xyzfilename: ( prop: "" );
        --sass           (sass ext.)      Use sass extension.  
```

## Regarding `.js` files

_json-to-scss_ can convert `.js` files as long as these are a nodejs modules exporting a **javascript object**.

#### Example

```js
const colorRed = "#FF0000";
const colorBlue = "#0099FF";

module.exports = {
  colors: {
    red: colorRed,
    green: "#00FF00",
    white: colorBlue
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

##### Source file (myTokens.json):

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
  "web-browser-default-font-size": "16px"
}
```

##### Command:

###### Input:
```
$ json-to-scss ./Examples/Example1/ProjectDir/tokens/myTokens.json
```

###### Output:
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

###### Converted file (myTokens.scss):

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
  web-browser-default-font-size: 16px
);
```

