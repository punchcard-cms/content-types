/**
 *  @fileoverview Utility Functions
 *
 *  @author  Sam Richard
 */
'use strict';

const util = require('util');

/**
 * Filters an array of objects based on the value of a key in the objects
 *
 * @param {String} key - The key in the object to check
 * @param {String} value - The value to check against
 * @param {Array} arr - An array of {Object}s
 *
 * @return {Object|Boolean} - Will return the first filtered object, or `false` if no objects match
 */
exports.singleItem = (key, value, arr) => {
  const filtered = arr.filter(type => {
    if (type[key] === value) {
      return true;
    }
    return false;
  });

  if (filtered.length === 0) {
    return false;
  }
  return filtered[0];
};

/**
 * Pretty prints big objects
 *
 * @param - The thing you want to log. Works best with deep nested {Object}s
 */
exports.log = (value) => {
  console.log(util.inspect(value, false, null));
};
