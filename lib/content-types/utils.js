'use strict';

const slugify = require('underscore.string/slugify');

/**
 * Check the structure of an attribute inside a content type configuration
 *
 * @param  {object} config - content type configuration
 * @param  {array} config.attributes - attributes config
 *
 * @returns {true|string} either true or an error string
 */
const attributes = (config) => {
  if (!config.hasOwnProperty('attributes') || config.attributes === '') {
    return `Content type '${config.name}' must have attributes`;
  }

  if (!Array.isArray(config.attributes)) {
    return `Attributes in content type '${config.name}' must be an array`;
  }

  if (config.attributes.length < 1) {
    return `Content type '${config.name}' must have at least one attribute`;
  }

  // map returns either true or a string; filter leaves us with just an array of strings
  const attrs = config.attributes.map(attr => {
    // attribute config requires an id
    if (!attr.hasOwnProperty('id') || attr.id === '') {
      return `Content type '${config.name}' config requires all attributes to have an id.`;
    }

    // if there is an, it must be a string
    if (attr.id && typeof attr.id !== 'string') {
      return `Attribute id in '${attr.name}' in content type '${config.name}' must be a string`;
    }

    // if there is a name, it must be a string
    if (attr.hasOwnProperty('name') && attr.name !== '' && typeof attr.name !== 'string') {
      return `Attribute names in content type '${config.name}' must be a string`;
    }

    // type is required to be there
    if (!attr.type || attr.type === '') {
      return `Attribute '${attr.name}' in content type '${config.name}' must have a type`;
    }

    // type has to be a string
    if (typeof attr.type !== 'string') {
      return `Attribute type in '${attr.name}' in content type '${config.name}' must be a string.`;
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
 * Check the structure of a content type configuration
 *
 * @param {object} config content type configuration
 *
 * @returns {true|string} either true or an error string
 */
const type = (config) => {
  if (typeof config !== 'object') {
    return 'Type must be an object';
  }

  if (!config.hasOwnProperty('name') || config.name === '') {
    return 'Content types require a name';
  }

  if (typeof config.name !== 'string') {
    return 'Content type name must be string';
  }

  if (!config.hasOwnProperty('id') || config.id === '') {
    return 'Content types require an id';
  }

  if (typeof config.id !== 'string') {
    return 'Content type id must be string';
  }

  if (config.id !== slugify(config.id)) {
    return `${config.id} needs to be written in kebab case (e.g. ${slugify(config.id)})`;
  }

  const attrs = attributes(config);

  if (attrs !== true) {
    return attrs;
  }

  // can't check identifier until we know attributes passes
  if (config.hasOwnProperty('identifier')) {
    if (typeof config.identifier !== 'string') {
      return `Identifier in content type '${config.name}' must be a string`;
    }

    // find attribute which is the identifier
    const attr = config.attributes.find(a => {
      return a.id === config.identifier;
    });

    if (!attr) {
      return `Identifier '${config.identifier}' is not an attribute in content type '${config.name}'.`;
    }

    // check attribute only has one input
    if (attr.inputs && Array.isArray(Object.keys(attr.inputs)) && Object.keys(attr.inputs).length > 1) {
      return `Attribute '${config.identifier}' in content type '${config.name}' cannot be the identifier. Only attributes with one input can be the identifier. Duh.`;
    }
  }

  return true;
};

module.exports = {
  check: {
    attributes,
    type,
  },
};
