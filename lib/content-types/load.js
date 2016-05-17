'use strict';

const dir = require('node-dir');
const yaml = require('js-yaml');
const kebab = require('lodash/kebabCase');
const globalConfig = require('config');
const path = require('path');
const util = require('../util');


/**
 * Gets all Content Types
 *
 * @returns {Promise} - An {Array} containing {Object} for each content type, including `name` {string}, `id` name {string}, and full config {object} loaded from YAML config file
 */
const load = () => {
  const types = [];
  const ids = [];
  let contentPath = path.join(process.cwd(), 'content-types');

  if (globalConfig.hasOwnProperty('contentTypes')) {
    if (globalConfig.contentTypes.hasOwnProperty('directory')) {
      contentPath = globalConfig.contentTypes.directory;
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

      if (!config.hasOwnProperty('name')) {
        reject(new Error('Content types require a name'));
      }

      if (!config.hasOwnProperty('id')) {
        reject(new Error('Content types require an id'));
      }
      const id = kebab(config.id);

      if (ids.indexOf(id) === -1) {
        ids.push(id);
        config.id = id;
        types.push(config);
      }
      else {
        reject(new Error(`Content type ${id} is duplicated!`));
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
 * @param {string} id  kebab id of a content type
 * @param {array} types  array of content type objects
 *
 * @returns {array} array of content type's attribute objects
 */
const attributes = (id, types) => {
  const filtered = util.singleItem('id', id, types);

  return filtered ? filtered[0].attributes : false;
};


module.exports = load;
module.exports.names = names;
module.exports.attributes = attributes;
