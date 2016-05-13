'use strict';

const nunjucks = require('nunjucks');

const renderer = (type) => {
  return new Promise((res) => {
    let rendered = type.attributes.map(input => {
      const inputs = Object.keys(input.inputs).length;
      const description = input.hasOwnProperty('description') && input.description !== '';
      const context = input.inputs;
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
      render += nunjucks.renderString(input.html, context);

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
