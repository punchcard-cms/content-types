'use strict';

const plugabilly = require('plugabilly');
const merge = require('deepmerge');
const uuid = require('uuid');
const _ = require('lodash');
const slugify = require('underscore.string/slugify');
const globalConfig = require('config');

const utils = require('./utils');

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

      // test content type configuration
      if (utils.check.type(type) !== true) {
        reject(new Error(utils.check.type(type)));
      }

      const attrs = mergedType.attributes.map((attribute, index) => {
        let plugin = Object.keys(plugins).indexOf(`input-plugin-${attribute.type}`);

        // Reject if input plugin isn't available
        if (plugin === -1) {
          reject(new Error(`Input '${attribute.type}' not found`));
        }

        plugin = _.cloneDeep(plugins[`input-plugin-${attribute.type}`]);

        // we need to know the name first in case there is no id
        if (attribute.name) {
          plugin.name = attribute.name;
        }

        // Reject if plugin instance ID is duplicated due to lack of attribute id
        if (!attribute.hasOwnProperty('id') && ids.indexOf(slugify(plugin.name)) !== -1) {
          reject(new Error(`Input ID '${slugify(plugin.name)}' in content type '${type.name}' has a duplicate id. Try adding a unique id to attribute ${index+1} in the config.`));
        }

        // if attribute has no id in content type config, slugify the name
        if (!attribute.hasOwnProperty('id')) {
          attribute.id = slugify(plugin.name);
        }

        // Reject if plugin instance ID is duplicated
        if (ids.indexOf(attribute.id) !== -1) {
          reject(new Error(`Input ID '${attribute.id}' in content type '${type.name}' cannot be duplicated (in '${plugin.name}')`));
        }

        ids.push(attribute.id);

        if (attribute.description) {
          plugin.description = attribute.description;
        }
        if (attribute.required) {
          plugin.required = requiredLevel(attribute.required);
        }

        // Organizes repeatable attributes
        if (attribute.repeatable) {
          if (typeof attribute.repeatable === 'object') {
            plugin.repeatable = {};
            if (!attribute.repeatable.hasOwnProperty('min')) {
              plugin.repeatable.min = 1;
            }
            else {
              plugin.repeatable.min = attribute.repeatable.min;
            }
            if (!attribute.repeatable.hasOwnProperty('max')) {
              plugin.repeatable.max = Number.MAX_SAFE_INTEGER;
            }
            else {
              plugin.repeatable.max = attribute.repeatable.max;
            }
          }
          else if (attribute.repeatable === true) {
            plugin.repeatable = {
              min: 1,
              max: Number.MAX_SAFE_INTEGER,
            };
          }
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

      if (mergedType.identifier) {
        let contender = attrs.find(attr => {
          return (attr.id === mergedType.identifier && Object.keys(attr.inputs).length === 1);
        });

        if (!contender) {
          reject(new Error(`Identifier ${mergedType.identifier} in content type '${type.name}' has more than one input. Only single-input attributes may be the identifier.`));
        }

        contender = attrs.find(attr => {
          return (attr.id === mergedType.identifier && !attr.repeatable);
        });

        if (!contender) {
          reject(new Error(`Identifier ${mergedType.identifier} in content type '${type.name}' is repeatable. Only non-repeatable attributes may be the identifier.`));
        }
      }
      else {
        const contender = attrs.find(attr => {
          return (Object.keys(attr.inputs).length === 1 && !attr.repeatable);
        });

        if (!contender) {
          reject(new Error(`Content type '${type.name}' does not have an attribute which can be an identifier.`));
        }

        mergedType.identifier = contender.id;
      }

      mergedType.attributes = attrs;

      return mergedType;
    });

    resolve(configured);
  });
};

module.exports = squish;
