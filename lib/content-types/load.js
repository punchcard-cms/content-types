'use strict';

const dir = require('node-dir');
const yaml = require('js-yaml');
const globalConfig = require('config');
const path = require('path');
const util = require('../util');
const utils = require('./utils');

/**
 * Gets all Content Types
 *
 * @returns {Promise} - An {Array} containing {Object} for each content type, including `name` {string}, `id` name {string}, and full config {object} loaded from YAML config file
 */
const load = () => {
  const types = [];
  const ids = [];
  let contentPath = path.join(process.cwd(), 'content-types');

  if (globalConfig.hasOwnProperty('content')) {
    if (globalConfig.content.hasOwnProperty('directory')) {
      contentPath = globalConfig.content.directory;
    }
  }

  return new Promise((resolve, reject) => {
    dir.readFiles(contentPath, {
      match: /.yml$/,
      exclude: /^\./,
    }, (err, content, next) => {
      if (err) {
        reject(err);
      }

      const config = yaml.safeLoad(content);

      // test content type configuration
      if (utils.check.type(config) !== true) {
        reject(new Error(utils.type(config)));
      }

      if (ids.indexOf(config.id) === -1) {
        ids.push(config.id);
        types.push(config);
      }
      else {
        reject(new Error(`Content type ${config.id} is duplicated!`));
      }

      next();
    }, (err) => {
      if (err) {
        reject(err);
      }
      resolve(types);
    });
  });
};

/**
 * Names of Content Types
 *
 * @param {array} types - Array of content types
 *
 * @returns {array} of Content Type names
 */
const names = types => {
  return types.map(type => {
    return type.name;
  });
};

/**
 * Attributes of a Content Type
 *
 * @param {string} id  id of a content type
 * @param {array} types  array of content type objects
 *
 * @returns {array} array of content type's attribute objects
 */
const attributes = (id, types) => {
  const filtered = util.singleItem('id', id, types);

  if (Array.isArray(filtered.attributes) && (filtered.attributes.length > 0)) {
    return filtered.attributes;
  }

  return false;
};

module.exports = load;
module.exports.names = names;
module.exports.attributes = attributes;
