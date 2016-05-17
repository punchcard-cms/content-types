'use strict';

const loader = require('./content-types/load');
const merge = require('./content-types/merge');
const only = require('./content-types/only');
const util = require('./util');

/**
 * Get single Content Type
 *
 * @param {string} id kebab-case id of content type
 * @param {array} types array of content type objects
 *
 * @returns {object} content type object
 */
const findCT = (id, types) => {
  const ct = util.singleItem('id', id, types);

  if (ct === false) {
    throw new Error(`Content type ${id} not found `);
  }

  return ct;
};

/**
 * Get all Content Types
 *
 * @returns {Promise} - An {Array} containing {Object} for each content type, including `name` {String}, `id` name {String}, and full config {Object} loaded from YAML config file
 */
const raw = loader;

/*
 * Merge content type object with input plugin data
 *
 * @param {array} content content types array
 *
 * @returns {array} content types array; merged with input plugins and user settings
 */
const merged = (content) => {
  if (content) {
    return merge(content);
  }

  return raw().then(types => {
    return merge(types);
  });
};

const onlyCT = (type, config, loadedTypes) => {
  const userConfig = config || {};

  if (loadedTypes) {
    const ct = findCT(type, loadedTypes);

    return only(ct, userConfig);
  }

  return merged().then(types => {
    const ct = findCT(type, types);

    return only(ct, userConfig);
  });
};

module.exports = merged;
module.exports.raw = raw;
module.exports.only = onlyCT;
