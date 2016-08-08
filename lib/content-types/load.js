'use strict';

const dir = require('node-dir');
const yaml = require('js-yaml');
const slugify = require('lodash/kebabCase');
const globalConfig = require('config');
const path = require('path');
const utils = require('../utils');


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

      if (!config.hasOwnProperty('name')) {
        reject(new Error('Content types require a name'));
      }

      if (!config.hasOwnProperty('id')) {
        reject(new Error('Content types require an id'));
      }

      if (config.id !== slugify(config.id)) {
        reject(new Error(`${config.id} needs to be written in kebab case (e.g. ${slugify(config.id)}`));
      }

      if (ids.indexOf(config.id) === -1) {
        ids.push(config.id);
        types.push(config);
      }
      else {
        reject(new Error(`Content type ${config.id} is duplicated!`));
      }

      if (!config.hasOwnProperty('identifier')) {
        reject(new Error(`Identifier missing in content type '${config.name}'.`));
      }

      if (config.hasOwnProperty('identifier')) {
        if (typeof config.identifier !== 'string') {
          reject(new Error(`Identifier in content type '${config.name}' must be a string`));
        }
      }

      // find attribute which is the identifier
      const attr = config.attributes.find(a => {
        return a.id === config.identifier;
      });

      if (!attr) {
        reject(new Error(`Identifier '${config.identifier}' is not an attribute in content type '${config.name}'.`));
      }

      // check attribute only has one input
      if (attr.inputs && Array.isArray(Object.keys(attr.inputs)) && Object.keys(attr.inputs).length > 1) {
        reject(new Error(`Attribute '${config.identifier}' in content type '${config.name}' cannot be the identifier. Only attributes with one input can be the identifier.`));
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
  const filtered = utils.singleItem('id', id, types);

  return filtered ? filtered[0].attributes : false;
};


module.exports = load;
module.exports.names = names;
module.exports.attributes = attributes;
