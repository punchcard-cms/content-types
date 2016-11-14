'use strict';

const nunjucks = require('nunjucks');

/*
 * Add Error Messaging to Rendered Inputs
 *
 * @param {string} html - Rendered HTML
 * @param {InputType} type - Input type being rendered
 * @param {FormInputValues} - Errors associated with form inputs
 * @param {Integer} - Index of the instance if repeatable
 *
 * @returns {string} - Rendered HTML, with appropriate error messages, and aria labels for invalid inputs
 */
const addError = (html, input, errors, index) => {
  let render = html;
  let result = '';
  const inputs = [];
  if (errors) {
    if (Array.isArray(input.inputs) && index !== undefined) {
      Object.keys(input.inputs[index]).map(inp => {
        inputs.push({
          name: `${input.id}--${inp}--${index}`,
          id: input.inputs[index][inp].id,
        });
      });
    }
    else {
      Object.keys(input.inputs).map(inp => {
        inputs.push({
          name: `${input.id}--${inp}`,
          id: input.inputs[inp].id,
        });
      });
    }
    inputs.map(inp => {
      const find = new RegExp(`name=['"]\\s*${inp.name}\\s*['"]`);
      const errored = render.replace(find, `name="${inp.name}" aria-invalid="true"`);

      if (errors.hasOwnProperty(inp.name)) {
        result += `<p class="form--alert" role="alert" for="${inp.id}">${errors[inp.name]}</p>`;
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
 * @param {Integer} - Index of the instance if repeatable
 *
 * @returns {string} - Rendered HTML, with required indicators
 */
const addRequired = (html, input, index) => {
  let render = html;
  let result = '';
  const inputs = [];
  if (Array.isArray(input.inputs) && index !== undefined) {
    Object.keys(input.inputs[index]).map(inp => {
      inputs.push({
        required: input.inputs[index][inp].required,
        name: `${input.id}--${inp}--${index}`,
        id: input.inputs[index][inp].id,
        type: input.inputs[index][inp].type,
      });
    });
  }
  else {
    Object.keys(input.inputs).map(inp => {
      inputs.push({
        required: input.inputs[inp].required,
        name: `${input.id}--${inp}`,
        id: input.inputs[inp].id,
        type: input.inputs[inp].type,
      });
    });
  }

  inputs.map(inp => {
    // Skip the required attribute for checkbox and radio on browser
    if (inp.type === 'checkbox' || inp.type === 'radio') {
      return;
    }

    if (input.required === 'save' || inp.required === 'save' || input.required === 'publish' || inp.required === 'publish') {
      const required = inp.required || input.required;
      const level = `required--${required}`;

      // pre-regex strings
      const stringFor = `for=["']\\s*${inp.id}\\s*["']`;

      // regex to get the label for THIS input
      const regexLabel = new RegExp(`.*(<label[\\w\\W\\s]*${stringFor}[\\w\\W\\s]*?>)`);

      // THIS input's label
      const label = render.match(regexLabel);

      // checks if label is not found
      if (label === null || !Array.isArray(label) || label.length < 2) {
        return;
      }

      // regex to search for `for`
      const reFor = new RegExp(`(${stringFor})`);
      render = render.replace(reFor, `for="${inp.id}"`);

      // add required to input
      const reName = new RegExp(`name=['"]\\s*${inp.name}\\s*['"]`);
      render = render.replace(reName, `name="${inp.name}" aria-required="true" required`);

      // Add required text to label
      const reLabel = new RegExp('</label>');
      render = render.replace(reLabel, `\u00a0<mark class="${level}">required to ${required}</mark>`);
      render += '</label>';
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
      let inputs = Object.keys(input.inputs).length;
      if (Array.isArray(input.inputs) && input.inputs.length > 0) {
        inputs = Object.keys(input.inputs[0]).length;
      }
      const description = input.hasOwnProperty('description') && input.description !== '';
      const context = input.inputs;
      let html = nunjucks.renderString(input.html, context);
      let render = '';

      // Set opening tags based on number of inputs
      if (inputs > 1) {
        render += `<fieldset id="${input.id}" class="form--fieldset">`;
        render += `<legend class="form--legend">${input.name}</legend>`;

        // Add Description
        if (description) {
          render += `<p class="form--description">${input.description}</p>`;
        }
      }
      else {
        render += `<div id="${input.id}" class="form--field">`;
      }

      // Wraps repeatable attributes around div
      if (Array.isArray(input.inputs) && input.hasOwnProperty('repeatable')) {
        context.forEach((data, index) => {
          render += `<div id="sub-${input.id}--${index}" class="form--repeatable">`;
          html = nunjucks.renderString(input.html, data);

          // Add error messaging and required
          render += addRequired(addError(html, input, errors, index), input, index);

          // Adds delete button if instances are greater than minimum
          if (input.inputs.length > input.repeatable.min) {
            render += `<button type="button" class="form--delete" id="${input.id}--delete--${index}">Delete</button>`;
          }
          render += '</div>';
        });
        if (input.inputs.length < input.repeatable.max) {
          render += `<button type="button" class="form--add" id="${input.id}--add">Add</button>`;
        }
      }
      else {
        // Add error messaging and required
        render += addRequired(addError(html, input, errors), input);
      }

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
module.exports.error = addError;
module.exports.required = addRequired;
