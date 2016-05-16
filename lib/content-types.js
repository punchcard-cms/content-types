'use strict';

const loader = require('./content-types/load');
const merge = require('./content-types/merge');
const only = require('./content-types/only');
const util = require('./util');

const findCT = (type, types) => {
  const ct = util.singleItem('machine', type, types);

  if (ct === false) {
    throw new Error(`Content type ${type} not found `);
  }

  return ct;
};

/**
 * Get all Content Types
 *
 * @returns {Promise} - An {Array} containing {Object} for each content type, including `name` {String}, `machine` name {String}, and full config {Object} loaded from YAML config file
 */
const raw = loader;

const merged = () => {
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
