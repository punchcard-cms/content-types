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
const singleItem = (key, value, arr) => {
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
 * Pop the last element if length > 1 after splitting the string
 *
 * @param {string} input - Input string to be split
 * @param {string} splitter - string to split against
 *
 * @returns {string} - remaining string after pop
 */
const splitPop = (input, splitter) => {
  let blocks = input.split(splitter);
  if (blocks.length > 1) {
    blocks.pop();
  }
  blocks = blocks.join(splitter);

  return blocks;
};

/**
 * Get plugin directories from global config
 *
 * @param {object} globalConfig - global configuration file contains plugin directories
 *
 * @returns {array} array of directory paths
 */
const getPluginsDirs = (globalConfig) => {
  const root = exec('npm root').toString().trim();
  const core = _.get(globalConfig, 'content.plugins.core.directory', []);
  const local = _.get(globalConfig, 'content.plugins.local.directory', []);

  const dirs = [];

  // add core module plugin directories
  if (Array.isArray(core)) {
    core.map(dir => {
      if (typeof dir === 'string') {
        if (dirs.indexOf(dir) === -1) {
          dirs.push(dir);
        }
      }
    });
  }
  else if (typeof core === 'string') {
    dirs.push(core);
  }

  // add local app plugin directories
  if (Array.isArray(local)) {
    local.map(dir => {
      if (typeof dir === 'string') {
        if (dirs.indexOf(dir) === -1) {
          dirs.push(dir);
        }
      }
    });
  }
  else if (typeof local === 'string') {
    dirs.push(local);
  }

  // Checks if path to node_modules exists
  if (dirs.indexOf(root) === -1) {
    dirs.push(root);
  }

  return dirs;
};

/**
 * Gets plugins from node_modules and other directories
 *
 * @param {object} globalConfig - Configuration object
 *
 * @returns {object} - all input plugins with path
 */
const getPlugins = (globalConfig) => {
  const dirs = getPluginsDirs(globalConfig);
  const existing = {};

  // Adds path of input-plugins to existing
  dirs.forEach((directory) => {
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
const log = (value) => {
  // Meant to console log this out here
  console.log(util.inspect(value, false, null)); // eslint-disable-line no-console
};

module.exports = {
  singleItem,
  splitPop,
  getPluginsDirs,
  getPlugins,
  log,
};
