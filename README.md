# JSON-TO-SCSS
<p>
  <a href="https://npmcharts.com/compare/json-to-scss?minimal=true"><img src="https://img.shields.io/npm/dm/json-to-scss.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/json-to-scss"><img src="https://img.shields.io/npm/v/json-to-scss.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/json-to-scss"><img src="https://img.shields.io/npm/l/json-to-scss.svg" alt="License"></a>
</p>

> Convert your js & json files to sass or scss files.

A small utility to convert js & json file(s) to scss/sass file(s).

This library has initially been created to help make javascript defined design tokens more easily available to sass preprocessor...

[Andrew Clark](https://github.com/acdlite)'s [json-sass](https://github.com/acdlite/json-sass) library has been a significant source of inspiration for this version. Feel free to check-it out.


## Installation
To use _json-to-scss_ as development dependency with...

#### Yarn
```
yarn add -D json-to-scss
```

#### Npm
```
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