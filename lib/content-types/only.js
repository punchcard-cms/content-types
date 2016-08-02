'use strict';

const merge = require('deepmerge');
const util = require('../util');

const only = (type, config) => {
  return new Promise((resolve) => {
    const mergedType = type;
    const configured = Object.keys(config);
    const attrs = mergedType.attributes.map(attribute => {
      const attr = attribute;
      let inputs;

      if (Array.isArray(attr.inputs)) {
        inputs = Object.keys(attr.inputs[0]);
      }
      else {
        inputs = Object.keys(attr.inputs);
      }

      // If there isn't a configuration for this input, move along
      if (configured.indexOf(attr.id) === -1) {
        return attr;
      }

      // Flattens multiple instances
      if (Array.isArray(config[attr.id])) {
        attr.inputs = config[attr.id].map((data, index) => {
          const instance = merge(attr.inputs[0], data);
          inputs.forEach(input => {
            instance[input].validation = attribute.inputs[0][input].validation;
            instance[input].type = attribute.inputs[0][input].type;
            instance[input].id = `${util.splitPop(attribute.inputs[0][input].id, '--')}--${index}`;
            instance[input].name = `${util.splitPop(attribute.inputs[0][input].name, '--')}--${index}`;
          });

          return instance;
        });
      }
      else {
        // Merge configuration for the inputs and the configuration
        attr.inputs = merge(attr.inputs, config[attr.id]);

        // Override the validation, type, and ID for all inputs that matter
        inputs.forEach(input => {
          attr.inputs[input].validation = attribute.inputs[input].validation;
          attr.inputs[input].type = attribute.inputs[input].type;
          attr.inputs[input].id = attribute.inputs[input].id;
          attr.inputs[input].name = attribute.inputs[input].name;
        });
      }

      return attr;
    });

    mergedType.attributes = attrs;

    resolve(mergedType);
  });
};


module.exports = only;
