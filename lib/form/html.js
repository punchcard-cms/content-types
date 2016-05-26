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
      const find = new RegExp(`/name=['"]\\s*${name}\\s*['"]/`);
      const errored = render.replace(find, `name="${name}" aria-invalid="true"`);

      if (errors.hasOwnProperty(name)) {
        result += `<p class="form--alert" role="alert" for="${input.inputs[inp].id}">${errors[name]}</p>`;

        render = errored;
      }
    });
  }

  result += html;

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

      // Set opening tags based on number of inputs
      if (inputs > 1) {
        render += `<fieldset id="${input.id}" class="form--fieldset">`;
        render += `<lengend class="form--lengend">${input.name}</lengend>`;

        // Add Description
        if (description) {
          render += `<p class="form--description">${input.description}</p>`;
        }
      }
      else {
        render += `<div id="${input.id}" class="form--field">`;
      }

      // Render the form element
      render += addError(html, input, errors);

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
