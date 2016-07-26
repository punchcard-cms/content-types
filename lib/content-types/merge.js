'use strict';

const plugabilly = require('plugabilly');
const merge = require('deepmerge');
const uuid = require('uuid');
const _ = require('lodash');
const globalConfig = require('config');

const configPlugins = {};

/**
 * Retrieve Input Plugins
 *
 * {Object} - [Plugabilly](https://github.com/Snugug/plugabilly) object
 */
if (globalConfig.hasOwnProperty('content')) {
  if (globalConfig.content.hasOwnProperty('plugins')) {
    configPlugins.search = globalConfig.content.plugins.directory;
  }
}
const plugins = plugabilly(configPlugins).name().containsSync('input-plugin-');

/*
 * Determine required level
 *
 * @param {string} level - `required` level written in config
 *
 * @returns {string} system-compliant level string
 */
const requiredLevel = (level) => {
  if ((level === true) || (level === 'save') || (level === 2)) {
    return 'save';
  }
  if ((level === 'publish') || (level === 1)) {
    return 'publish';
  }

  return false;
};

/*
 * Combine content types configurations with input plugins
 *
 * @param {array} types - content types configurations
 *
 * @returns {promise} - combined content type with input plugin configs
 */
const squish = (types) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(types)) {
      reject(new Error('Content types must be an array'));
    }

    const configured = types.map(type => {
      const mergedType = type;
      const ids = [];
      let key;

      const attrs = mergedType.attributes.map(attribute => {
        let plugin = Object.keys(plugins).indexOf(`input-plugin-${attribute.type}`);

        // Reject if input plugin isn't available
        if (plugin === -1) {
          reject(new Error(`Input '${attribute.type}' not found`));
        }

        // Reject if plugin instance doesn't have a name
        if (!attribute.hasOwnProperty('name')) {
          let identifier = attribute.type;

          if (attribute.hasOwnProperty('id')) {
            identifier = attribute.id;
          }
          reject(new Error(`Input '${identifier}' in content type '${type.name}' needs a name`));
        }

        // Reject if plugin instance doesn't have an ID
        if (!attribute.hasOwnProperty('id')) {
          reject(new Error(`Input '${attribute.name}' in content type '${type.name}' needs an ID`));
        }

        // Reject if plugin instance ID is duplicated
        if (ids.indexOf(attribute.id) !== -1) {
          reject(new Error(`Input ID '${attribute.id}' in content type '${type.name}' cannot be duplicated (in '${attribute.name}')`));
        }

        // Reject if ID isn't kebab case
        if (_.kebabCase(attribute.id) !== attribute.id) {
          reject(new Error(`Input ID '${attribute.id}' needs to be written in kebab case (e.g. '${_.kebabCase(attribute.id)}')`));
        }

        // Checking for key
        if (attribute.hasOwnProperty('key')) {
          // key attributes cannot be repeatables
          if (attribute.hasOwnProperty('repeatable')) {
            reject(new Error(`Repeatable attributes can not be the key. Input '${attribute.name}' in content type '${type.name}' is repeatable and has key: true.`));
          }

          // there is already a key
          if (key !== undefined) {
            reject(new Error(`Only one attribute can be the key. Input '${attribute.name}' in content type '${type.name}' has the second key found.`));
          }

          // the input plugin for this attribute has more than one input
          if (plugins[`input-plugin-${attribute.type}`].hasOwnProperty('inputs') && Object.keys(plugins[`input-plugin-${attribute.type}`].inputs).length > 1) {
            reject(new Error(`Only attributes with one input can be the key. Plugin 'input-plugin-${attribute.type}' in content type '${type.name}' has more than one input.`));
          }
          key = attribute.id;
        }

        ids.push(attribute.id);

        plugin = _.cloneDeep(plugins[`input-plugin-${attribute.type}`]);

        if (attribute.name) {
          plugin.name = attribute.name;
        }
        if (attribute.description) {
          plugin.description = attribute.description;
        }
        if (attribute.required) {
          plugin.required = requiredLevel(attribute.required);
        }

        plugin.id = attribute.id;
        plugin.type = attribute.type;

        // Set Default Label from Plugin Name
        if (Object.keys(plugin.inputs).length === 1) {
          const input = Object.keys(plugin.inputs)[0];

          plugin.inputs[input].label = plugin.name;
        }

        // Merge Content Type settings with default configuration for each input
        if (attribute.inputs) {
          Object.keys(attribute.inputs).forEach(attr => {
            if (Object.keys(plugin.inputs).indexOf(attr) > -1) {
              // Merge attribute's options with default
              const merged = merge(plugin.inputs[attr], attribute.inputs[attr]);

              // Override any overriding with defaults
              merged.validation = plugin.inputs[attr].validation;
              merged.type = plugin.inputs[attr].type;

              if (plugin.inputs[attr].hasOwnProperty('script')) {
                merged.script = plugin.inputs[attr].script;
              }

              // Options of attribute overrides default
              if (attribute.inputs[attr].hasOwnProperty('options')) {
                merged.options = attribute.inputs[attr].options;
              }

              // add required if it doesn't exist
              if (!merged.hasOwnProperty('required')) {
                merged.required = plugin.required;
              }
              else {
                merged.required = requiredLevel(merged.required);
              }

              plugin.inputs[attr] = merged;
            }
          });
        }


        // Add Unique ID to each input
        Object.keys(plugin.inputs).forEach(input => {
          plugin.inputs[input].id = uuid.v4();
          plugin.inputs[input].name = `${plugin.id}--${input}`;
        });


        return plugin;
      });

      if (key !== undefined) {
        mergedType.key = key;
      }
      else {
        const keyattr = attrs.find(attr => {
          return Object.keys(attr.inputs).length === 1;
        });
        if (keyattr === undefined) {
          reject(new Error(`Content type '${type.name}', does not have an attribute with one input that can be used as a key.`));
        }
        mergedType.key = keyattr.id;
      }

      mergedType.attributes = attrs;

      return mergedType;
    });

    resolve(configured);
  });
};

module.exports = squish;
