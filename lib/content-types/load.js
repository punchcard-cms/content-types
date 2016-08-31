'use strict';

const dir = require('node-dir');
const yaml = require('js-yaml');
const slugify = require('lodash/kebabCase');
const path = require('path');
const utils = require('../utils');


/**
 * Gets all Content Types
 *
 * @param {object} config - configuration object
 *
 * @returns {Promise} - An {Array} containing {Object} for each content type, including `name` {string}, `id` name {string}, and full config {object} loaded from YAML config file
 */
const load = (config) => {
  const configuration = config || {};
  const types = [];
  const ids = [];
  let contentPath = path.join(process.cwd(), 'content-types');

  return new Promise((resolve, reject) => {
    if (typeof configuration !== 'object') {
      reject(new Error('Configuration parameter must be an object'));
    }

    if (configuration.hasOwnProperty('content')) {
      if (configuration.content.hasOwnProperty('directory')) {
        contentPath = configuration.content.directory;
      }
    }

    dir.readFiles(contentPath, {
      match: /.yml$/,
      exclude: /^\./,
    }, (err, content, next) => {
      if (err) {
        reject(err);
      }

      const type = yaml.safeLoad(content);

      if (!type.hasOwnProperty('name')) {
        reject(new Error('Content types require a name'));
      }

      if (!type.hasOwnProperty('id')) {
        reject(new Error('Content types require an id'));
      }

      if (type.id !== slugify(type.id)) {
        reject(new Error(`${type.id} needs to be written in kebab case (e.g. ${slugify(type.id)}`));
      }

      if (ids.indexOf(type.id) === -1) {
        ids.push(type.id);
        types.push(type);
      }
      else {
        reject(new Error(`Content type ${type.id} is duplicated!`));
      }

      if (!type.hasOwnProperty('identifier')) {
        reject(new Error(`Identifier missing in content type '${type.name}'.`));
      }

      if (type.hasOwnProperty('identifier')) {
        if (typeof type.identifier !== 'string') {
          reject(new Error(`Identifier in content type '${type.name}' must be a string`));
        }
      }

      // find attribute which is the identifier
      const attr = type.attributes.find(a => {
        return a.id === type.identifier;
      });

      if (attr === undefined) {
        reject(new Error(`Identifier '${type.identifier}' is not an attribute in content type '${type.name}'.`));
      }

      // check attribute only has one input
      if (attr.inputs && Array.isArray(Object.keys(attr.inputs)) && Object.keys(attr.inputs).length > 1) {
        reject(new Error(`Attribute '${type.identifier}' in content type '${type.name}' cannot be the identifier. Only attributes with one input can be the identifier.`));
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
