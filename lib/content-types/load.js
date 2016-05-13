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
 * @return {Promise} - An {Array} containing {Object} for each content type, including `name` {String}, `machine` name {String}, and full config {Object} loaded from YAML config file
 */
const load = () => {
  const types = [];
  const machineNames = [];
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
      const name = config.name;
      const machine = kebab(config.name);

      if (!config.hasOwnProperty('name')) {
        reject(new Error('Content types require a name'));
      }

      if (machineNames.indexOf(machine) === -1) {
        machineNames.push(name);
        config.machine = machine;
        types.push(config);
      }
      else {
        reject(new Error(`Content type ${machine} is duplicated!`));
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
 * @returns {Array} of Content Type names
 */
const names = (types) => {
  return types.map(type => type.name);
};


const attributes = (machine, types) => {
  const filtered = util.singleItem('machine', machine, types);
  return filtered ? filtered[0].attributes : false;
};


module.exports = load;
module.exports.names = names;
module.exports.attributes = attributes;
