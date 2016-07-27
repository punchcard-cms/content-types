'use strict';

const util = require('../util');

/*
 * @typedef FormInputValues
 * @type object
 *
 * @property {string} {{input-plugin-id}}--{{input-plugin-component}}[--{{filed-instance}}] - The value of the input field. The name of the input field is in the given form
 */

/*
 * @typedef SplitInputValues
 * @type object
 *
 * @property {string} plugin - The Input Plugin ID (from plugin configuration)
 * @property {string} input - The Input Plugin component (from plugin)
 * @property {string|undefined} index - The index of the repeatable element ({undefined} if not a repeatable)
 * @property {string} value - The value from the field input
 */

/*
 * Splits raw form input into object we can use
 *
 * @param {FormInputValues} raw - The input from a form
 *
 * @returns {SplitInputValues} - The structured values to test
 */
const split = raw => {
  const output = Object.keys(raw).filter(input => {
    const boom = input.split('--');
    if (boom.length >= 2) {
      return true;
    }

    return false;
  });

  return output.map(input => {
    const boom = input.split('--');
    const value = raw[input];

    return {
      plugin: boom[0],
      input: boom[1],
      index: boom[2],
      value,
    };
  });
};

/*
 * @typedef WorkingInputValues
 * @type SplitInputValues
 *
 * @property {string|boolean} validation - The result of running validation for the {SplitInputValues}. A {string} is an error message, a {boolean} (can only be true) for valid input.
 */

/*
 * Determines if there are any errors in validation
 *
 * @param {WorkingInputValues} working - The validated input values
 *
 * @returns {true|FormInputValues} - Returns `true` if there are no validation issues, {FormInputValues} with error messages as values if there are
 */
const join = working => {
  const glue = {};

  working.map(input => {
    let key = `${input.plugin}--${input.input}`;

    if (input.index) {
      key += `--${input.index}`;
    }

    if (!input.hasOwnProperty('validation')) {
      throw new Error(`Validation for '${key}' requires a validation key!`);
    }

    if (input.validation !== true) {
      glue[key] = input.validation;
    }
  });

  if (Object.keys(glue).length !== 0) {
    return glue;
  }

  return true;
};

/*
 * @typedef ValidationSettings
 * @type object
 *
 * @property {object} {{input-plugin-id}} - The ID of the input plugin
 * @proeprty {object} {{input-plugin-id}}.{{input-plugin-component}} - The settings of the Input Plugin Component from the input type
 */

/*
 * Builds settings for use in validation
 *
 * @param {InputType} type - Input Type being tested
 *
 * @returns {ValidationSettings} - All validation settings
 */
const buildSettings = type => {
  const settings = {};

  type.attributes.map(plugin => {
    settings[plugin.id] = {};

    return Object.keys(plugin.inputs).map(input => {
      settings[plugin.id][input] = plugin.inputs[input].settings;
    });
  });

  return settings;
};

/*
 * Builds repeatable contraints for use in validation
 *
 * @param {InputType} type - Input Type being tested
 *
 * @returns {RepeatableContraints} - All valid repeatable contraints
 */
const buildRepeatables = type => {
  const repeatables = {};
  type.attributes.map(plugin => {
    repeatables[plugin.id] = {};
    if (plugin.hasOwnProperty('repeatable')) {
      repeatables[plugin.id] = plugin.repeatable;
    }
  });

  return repeatables;
};


/*
 * @typedef ValidationSingleValues
 * @type object
 *
 * @property {object} {{input-plugin-id}} - The ID of the input plugin
 * @proeprty {string} {{input-plugin-id}}.{{input-plugin-component}} - The value of the input field
 *
 */

/*
 * @typedef ValidationMultipleValues
 * @type object
 *
 * @property {object} {{input-plugin-id}} - The ID of the input plugin
 * @property {object} {{input-plugin-id}}.{{filed-instance}} - The field instance for a repeating field
 * @proeprty {string} {{input-plugin-id}}.{{filed-instance}}.{{input-plugin-component}} - The value of the input field
 *
 */

/*
 * Builds the values for use in validation
 *
 * @param {SplitInputValues} working - The structured values to test
 *
 * @returns {object} - An {object} of {ValidationSingleValues} or {ValidationMultipleValues} (depending on the specific input)
 */
const buildValues = working => {
  const values = {};

  working.map(value => {
    // If there isn't an existing key for the input plugin, make one
    if (!values.hasOwnProperty(value.plugin)) {
      if (value.index === undefined) {
        values[value.plugin] = {};
      }
      else {
        values[value.plugin] = [];
      }
    }

    // If there are multiple entries, build an object
    if (typeof value.index !== 'undefined') {
      // If the index doesn't exist, make it
      values[value.plugin][value.index] = {};

      // Set the value of the input to the value in the index
      values[value.plugin][value.index][value.input] = value.value;
    }
    else {
      // Set the value of the input to the value
      values[value.plugin][value.input] = value.value;
    }
  });

  return values;
};

/*
 * Checks for required fields before running validation
 *
 * @param {object} input - Input Type being tested
 * @param {ValidationSettings} settings - All validation settings
 *
 * @returns {true|FormInputValues} - Returns `true` if there are no validation or required issues, {FormInputValues} with error messages as values if there are
 */
const valueCheck = (input, settings, validation) => {
  if (input.target.hasOwnProperty('required') && (input.target.required === 'save' || input.target.required === 'publish') && input.target.value === '') {
    return 'Field cannot be left blank!';
  }

  if (settings.repeatable.hasOwnProperty('min') && ((!Array.isArray(input.all) && settings.repeatable.min > 1) || (Array.isArray(input.all) && input.all.length < settings.repeatable.min))) {
    return `At Least ${settings.repeatable.min} instances are required`;
  }

  return validation(input, settings);
};

/*
 * Validates the Raw Input
 *
 * @param {FormInputValues} raw - Raw form input
 * @param {InputType} type - Individual input type
 *
 * @returns {true|FormInputValues} - Returns `true` if there are no validation issues, {FormInputValues} with error messages as values if there are
 */
const validate = (raw, type) => {
  let working = split(raw);
  const allSettings = buildSettings(type);
  const allRepeatables = buildRepeatables(type);
  const values = buildValues(working);

  working = working.map(value => {
    const result = value;
    const plugin = util.singleItem('id', value.plugin, type.attributes);
    const input = {};
    const settings = {};

    // Build Input
    input.target = {};
    input.target.name = result.input;
    input.target.value = result.value;
    input.all = values[result.plugin];

    // check if parent plugin is required
    if (plugin.hasOwnProperty('required')) {
      input.target.required = plugin.required;
    }

    // check if input is required, supersede main plugin
    if (plugin.inputs[result.input].hasOwnProperty('required')) {
      input.target.required = plugin.inputs[result.input].required;
    }

    // Build Settings
    settings.target = allSettings[value.plugin][result.input];
    settings.all = allSettings[value.plugin];
    settings.repeatable = allRepeatables[value.plugin];

    // Run the validation function
    result.validation = valueCheck(input, settings, plugin.validation[plugin.inputs[result.input].validation.function]);

    return result;
  });

  return join(working);
};


module.exports = validate;
module.exports.split = split;
module.exports.join = join;
