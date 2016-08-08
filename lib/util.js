/**
 *  @fileoverview Utility Functions
 *
 *  @author  Sam Richard
 */
'use strict';

const util = require('util');
const exec = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/**
 * Filters an array of objects based on the value of a key in the objects
 *
 * @param {string} key - The key in the object to check
 * @param {string} value - The value to check against
 * @param {array} arr - An array of {Object}s
 *
 * @returns {object|boolean} - Will return the first filtered object, or `false` if no objects match
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
 * Pop the last element after splitting the string
 *
 * @param {string} input - Input string to be split
 * @param {string} splitter - string to split against
 *
 * @returns {string} - remaining string after pop
 */
exports.splitPop = (input, splitter) => {
  let blocks = input.split(splitter);
  blocks.pop();
  blocks = blocks.join(splitter);

  return blocks;
};

/**
 * Gets plugins from node_modules and other directories
 *
 * @param {object} globalConfig - Configuration object
 *
 * @returns {object} - all input plugins with path
 */
exports.getPlugins = (globalConfig) => {
  const existing = {};
  const root = exec('npm root').toString().trim();
  let dir = _.get(globalConfig, 'content.plugins.directory', []);

  // Check if configuration is set to string
  if (typeof dir === 'string') {
    dir = [dir];
  }

  // Adds path of node_modules to directory
  if (!Array.isArray(dir)) {
    dir = [root];
  }

  // Checks if path to node_modules exists
  else if (dir.indexOf(root) === -1) {
    dir.push(root);
  }

  // Adds path of input-plugins to existing
  dir.forEach((directory) => {
    fs.readdirSync(directory).forEach((file) => {
      if (file.indexOf('input-plugin') >= 0 && !existing.hasOwnProperty(file)) {
        existing[file] = path.join(directory, file);
      }
    });
  });

  return existing;
};

/**
 * Pretty prints big objects
 *
 * @param {string|object} value - The thing you want to log. Works best with deep nested {Object}s
 */
exports.log = (value) => {
  // Meant to console log this out here
  console.log(util.inspect(value, false, null)); // eslint-disable-line no-console
};
