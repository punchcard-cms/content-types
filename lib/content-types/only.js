'use strict';

const merge = require('deepmerge');

const only = (type, config) => {
  return new Promise((resolve) => {
    const mergedType = type;
    const configured = Object.keys(config);

    const attrs = mergedType.attributes.map(attribute => {
      const attr = attribute;
      const inputs = Object.keys(attr.inputs);

      // If there isn't a configuration for this input, move along
      if (configured.indexOf(attr.id) === -1) {
        return attr;
      }

      // Merge configuration for the inputs and the configuration
      attr.inputs = merge(attr.inputs, config[attr.id]);

      // Override the validation, type, and ID for all inputs that matter
      inputs.forEach(input => {
        attr.inputs[input].validation = attribute.inputs[input].validation;
        attr.inputs[input].type = attribute.inputs[input].type;
        attr.inputs[input].id = attribute.inputs[input].id;
        attr.inputs[input].name = attribute.inputs[input].name;
      });

      return attr;
    });

    mergedType.attributes = attrs;

    resolve(mergedType);
  });
};


module.exports = only;
