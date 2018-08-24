'use strict';

const jsToScssSassString = require('./lib/jsValueToSassString');

const myObj = {
  "prop1": {
    "prop11": "12px",
    "prop12": "auto",
    "prop13": "",
  },
  "prop2": [1, 2, 3],
  "prop3": null
};

console.log(jsToScssSassString(myObj));