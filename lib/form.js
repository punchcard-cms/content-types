'use strict';

const html = require('./form/html');
const scripts = require('./form/scripts');
const validate = require('./form/validate');

/**
 * Form configuration creator!
 *
 * @param  {InputType} type - Input type being rendered
 * @param  {FormInputValues} errors - Errors associated with form inputs
 * @param  {object} config - application configuration
 *
 * @returns {promise} - promise from scripts
 */
const form = (type, errors, config) => {
  const rendered = {};

  return html(type, errors).then(result => {
    rendered.html = result;

    return scripts(type, config);
  }).then(result => {
    rendered.scripts = result;
  }).then(() => {
    return rendered;
  });
};


module.exports = form;
module.exports.validate = validate;
