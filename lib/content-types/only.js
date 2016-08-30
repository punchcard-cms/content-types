'use strict';

const merge = require('deepmerge');
const utils = require('../utils');

/**
 * Retrieves one content type's config object, merged with input plugins and a form's values
 *
 * @param  {object} type merged content type object
 * @param  {object} vals values for inputs
 *
 * @returns {object}  content type object merged with input plugins and values
 */
const only = (type, vals) => {
  return new Promise((resolve) => {
    const mergedType = type;
    const values = vals;
    const configured = Object.keys(values);
    const attrs = mergedType.attributes.map(attribute => {
      const attr = attribute;
      let inputs;

      if (Array.isArray(attr.inputs)) {
        inputs = Object.keys(attr.inputs[0]);
      }
      else {
        inputs = Object.keys(attr.inputs);
      }

      // If there isn't a value for this input, move along
      if (configured.indexOf(attr.id) === -1) {
        return attr;
      }

      // check if repeatable but not an array
      if (attr.hasOwnProperty('repeatable') && typeof attr.repeatable === 'object' && !Array.isArray(values[attr.id])) {
        values[attr.id] = [values[attr.id]];
      }

      // Flattens multiple instances and updates ids and names
      if (Array.isArray(values[attr.id])) {
        attr.inputs = values[attr.id].map((data, index) => {
          const instance = merge(attr.inputs[0], data);
          inputs.forEach(input => {
            instance[input].validation = attribute.inputs[0][input].validation;
            instance[input].type = attribute.inputs[0][input].type;
            instance[input].id = `${utils.splitPop(attribute.inputs[0][input].id, '--')}--${index}`;
            instance[input].name = `${utils.splitPop(attribute.inputs[0][input].name, '--')}--${index}`;
          });

          return instance;
        });
      }
      else {
        // Merge configuration for the inputs and the values
        attr.inputs = merge(attr.inputs, values[attr.id]);

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
