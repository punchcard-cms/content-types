'use strict';

const nunjucks = require('nunjucks');

/*
 * Add Error Messaging to Rendered Inputs
 *
 * @param {string} html - Rendered HTML
 * @param {InputType} type - Input type being rendered
 * @param {FormInputValues} - Errors associated with form inputs
 *
 * @returns {string} - Rendered HTML, with appropriate error messages, and aria labels for invalid inputs
 */
const addError = (html, input, errors) => {
  let render = html;
  let result = '';

  if (errors) {
    Object.keys(input.inputs).map(inp => {
      const name = `${input.id}--${inp}`;
      const find = new RegExp(`name=['"]\\s*${name}\\s*['"]`);
      const errored = render.replace(find, `name="${name}" aria-invalid="true"`);

      if (errors.hasOwnProperty(name)) {
        result += `<p class="form--alert" role="alert" for="${input.inputs[inp].id}">${errors[name]}</p>`;

        render = errored;
      }
    });
  }

  result += render;

  return result;
};

/*
 * Add Required Rendered Inputs
 *
 * @param {string} html - Rendered HTML
 * @param {InputType} type - Input type being rendered
 *
 * @returns {string} - Rendered HTML, with required indicators
 */
const addRequired = (html, input) => {
  let render = html;
  let result = '';

  Object.keys(input.inputs).map(inp => {
    if (input.required === 'save' || input.inputs[inp].required === 'save' || input.required === 'publish' || input.inputs[inp].required === 'publish') {
      const id = input.inputs[inp].id;
      let level = '';

      if (input.inputs[inp].hasOwnProperty('required')) {
        level += `required--${input.inputs[inp].required}`;
      }
      else {
        level += `required--${input.required}`;
      }

      // regex to search for `class` in `label`
      const reClass = new RegExp('<label[\\w\\s\\W]+?(class=["\'][\\w\\W\\s]+?["\'])[\\w\\s\\W]+?>');

      // regex to search for `for`
      const reFor = new RegExp('(for=["\'][\\w\\W\\s]+?["\'])');

      // regex to get classes out of `class`
      const reClasses = new RegExp('class=["\']([\\w\\s\\W]+?)["\']');

      if (Array.isArray(render.match(reClass))) {
        // first, check if `class` exists in label
        const cls = render.match(reClass)[1].match(reClasses);
        const classes = cls[1].trim().split(/\s+/).concat([level]);
        const newClass = `class="${classes.join(' ')}"`;
        render = render.replace(cls[0], newClass);
      }
      else {
        // else, we add class after the `for` attribute
        render = render.replace(reFor, `for="${id}" class="${level}"`);
      }

      // add required to input
      const name = `${input.id}--${inp}`;
      const reName = new RegExp(`name=['"]\\s*${name}\\s*['"]`);
      render = render.replace(reName, `name="${name}" aria-required="true" required`);
    }
  });

  result += render;

  return result;
};

/*
 * Renders the input in to HTML
 *
 * @param {InputType} type - Input type being rendered
 * @param {FormInputValues} - Errors associated with form inputs
 *
 * @returns {string} - Rendered HTML form body (not wrapped in <form>)
 */
const renderer = (type, errors) => {
  return new Promise((res) => {
    let rendered = type.attributes.map(input => {
      const inputs = Object.keys(input.inputs).length;
      const description = input.hasOwnProperty('description') && input.description !== '';
      const context = input.inputs;
      const html = nunjucks.renderString(input.html, context);
      let render = '';
      let required = '';
      if (input.hasOwnProperty('required')) {
        required = `required--${input.required}`;
      }

      // Set opening tags based on number of inputs
      if (inputs > 1) {
        render += `<fieldset id="${input.id}" class="form--fieldset ${required}">`;
        render += `<lengend class="form--lengend">${input.name}</lengend>`;

        // Add Description
        if (description) {
          render += `<p class="form--description">${input.description}</p>`;
        }
      }
      else {
        render += `<div id="${input.id}" class="form--field ${required}">`;
      }

      // Add error messaging and required
      render += addRequired(addError(html, input, errors), input);

      // Set closing tags based on number of inputs
      if (inputs > 1) {
        render += '</fieldset>';
      }
      else {
        // Add Description
        if (description) {
          render += `<p class="form--description">${input.description}</p>`;
        }
        render += '</div>';
      }

      return render;
    });

    rendered = rendered.join('\n\n');
    res(rendered);
  });
};


module.exports = renderer;
