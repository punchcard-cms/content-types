'use strict';

const dir = require('node-dir');
const yaml = require('js-yaml');
const slugify = require('underscore.string/slugify');
const globalConfig = require('config');
const path = require('path');
const util = require('../util');

/**
 * Check the structure of a content type configuration
 *
 * @param {object} type content type configuration
 *
 * @returns {true|string} either true or an error string
 */
const check = (type) => {
  let identifier;
  if (typeof type !== 'object') {
    return 'Type must be an object';
  }

  if (!type.hasOwnProperty('name') || type.name === '') {
    return 'Content types require a name';
  }

  if (typeof type.name !== 'string') {
    return 'Content type name must be string';
  }

  if (!type.hasOwnProperty('id') || type.id === '') {
    return 'Content types require an id';
  }

  if (typeof type.id !== 'string') {
    return 'Content type id must be string';
  }

  if (type.id !== slugify(type.id)) {
    return `${type.id} needs to be written in kebab case (e.g. ${slugify(type.id)})`;
  }

  if (type.hasOwnProperty('identifier')) {
    if (typeof type.identifier !== 'boolean') {
      return 'Content type identifier must be a boolean';
    }

    if (type.identifier === true) {
      identifier = true;
    }
  }

  if (!type.hasOwnProperty('attributes')) {
    return 'A content type must have attributes';
  }

  if (!Array.isArray(type.attributes)) {
    return 'Content type attributes must be an array';
  }

  if (type.attributes.length < 1) {
    return 'Content type must have at least one attribute';
  }

  // map returns either true or a string; filter leaves us with just an array of strings
  const attrs = type.attributes.map(attr => {
    if (!attr.name || attr.name === '') {
      return 'Attribute must have a name';
    }
    if (typeof attr.name !== 'string') {
      return 'Attribute name must be a string';
    }
    if (!attr.id || attr.id === '') {
      return 'Attribute must have an id';
    }
    if (typeof attr.id !== 'string') {
      return 'Attribute id must be a string';
    }
    if (!attr.type || attr.type === '') {
      return 'Attribute must have a type';
    }
    if (typeof attr.type !== 'string') {
      return 'Attribute type must be a string';
    }

    return true;
  }).filter((res) => {
    if (res !== true) {
      return true;
    }

    return false;
  });

  // no errors are present
  if (!Array.isArray(attrs) || !attrs.length) {
    return true;
  }

  // return the first error
  return attrs[0];
};

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

      if (check(config) !== true) {
        reject(new Error(check(config)));
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
module.exports.check = check;
module.exports.names = names;
module.exports.attributes = attributes;
