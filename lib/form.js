'use strict';

const html = require('./form/html');
const validation = require('./form/validation');

// const scripts = require('./form/scripts');
// const css = require('./form/css');


const form = (type) => {
  const rendered = {};
  return html(type).then(result => {
    rendered.html = result;
    return validation(type);
  }).then(result => {
    rendered.validation = result;
  }).then(() => {
    return rendered;
  });
};


module.exports = form;
