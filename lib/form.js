'use strict';

const html = require('./form/html');
const scripts = require('./form/scripts');
const validate = require('./form/validate');

// const css = require('./form/css');


const form = (type, errors) => {
  const rendered = {};

  return html(type, errors).then(result => {
    rendered.html = result;

    return scripts(type);
  }).then(result => {
    rendered.scripts = result;
  }).then(() => {
    return rendered;
  });
};


module.exports = form;
module.exports.validate = validate;
