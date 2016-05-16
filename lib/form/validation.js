'use strict';

const b = require('browserify')();
const stream = require('stream');

// const util = require('../util');

const s = new stream.Readable();

const rendered = (type) => {
  return new Promise((res, rej) => {
    const validationFunctions = {};
    const allSettings = {};
    const inputs = {};
    const ids = {};
    let plugins = type.attributes.map(plugin => {
      return plugin.type;
    });

    plugins = plugins.filter((item, pos, self) => {
      return self.indexOf(item) === pos;
    });

    plugins.forEach(plugin => {
      // Require Plugins for Browserify
      b.require(`input-plugin-${plugin}`);
      validationFunctions[plugin] = `input-plugin-${plugin}`;
    });

    type.attributes.map(plugin => {
      const children = Object.keys(plugin.inputs);

      // All settings for this plugin
      allSettings[plugin.id] = {};

      // Add ID to all IDs
      ids[plugin.id] = plugin.id;

      children.forEach(input => {
        // Get input
        const inp = plugin.inputs[input];

        // Get its siblings
        const siblings = children.filter(child => {
          if (child === input) {
            return false;
          }

          return true;
        });

        // Set settings for this input blank as default
        allSettings[plugin.id][input] = {};

        // Set to actual settings if it exists
        if (inp.hasOwnProperty('settings')) {
          allSettings[plugin.id][input] = inp.settings;
        }

        // Build input object for this specific input
        inputs[inp.id] = {};
        inputs[inp.id].name = input;
        inputs[inp.id].validation = inp.validation;
        inputs[inp.id].settings = {};
        inputs[inp.id].parent = {
          id: plugin.id,
          type: plugin.type,
        };
        inputs[inp.id].siblings = {};

        if (inp.hasOwnProperty('settings')) {
          inputs[inp.id].settings = inp.settings;
        }

        // Get IDs for all siblings
        siblings.forEach(sibling => {
          inputs[inp.id].siblings[sibling] = plugin.inputs[sibling].id;
        });

        // Add ID to all IDs
        ids[inp.id] = inp.id;
      });
    });

    const validation = `
var allValidation = ${JSON.stringify(validationFunctions)};
var allInputs = ${JSON.stringify(inputs)};
var allSettings = ${JSON.stringify(allSettings)};
var allIDs = ${JSON.stringify(ids)};

// Work those requires
Object.keys(allValidation).forEach(function(plugin) {
  var plug = require(allValidation[plugin]);

  // Require the validation from the inputs
  allValidation[plugin] = plug.validation;
});

// Validation Function
var validate = function (e) {
  var target = e.target;
  var value = target.value;
  var inp = allInputs[target.id];
  var parent = allIDs[inp.parent.id];
  var input = {};
  var settings = {};
  var validation = false;
  var message;
  var currentMessage = parent.querySelector('[role="alert"][for="' + target.id + '"]');
  var insertRef;

  // Set up validation input
  input.target = {
    value: value,
    name: inp.name,
  };
  input.all = {};
  input.all[inp.name] = value;

  // Set up validation settings
  settings.target = inp.settings;
  settings.all = {};
  settings.all[inp.name] = inp.settings;

  // Set all sibling input and settings
  Object.keys(inp.siblings).forEach(function (sibling) {
    input.all[sibling] = allIDs[inp.siblings[sibling]].value;
    settings.all[sibling] = allSettings[inp.parent.id][sibling];
  });

  // Run the validation
  validation = allValidation[inp.parent.type][inp.validation.function](input, settings);

  // Add/Remove validation
  if (validation === true) {
    // Check to see if there is a current alert message for this input
    if (currentMessage) {
      // Remove invalid
      target.removeAttribute('aria-invalid');

      // Delete the current message if it exists
      parent.removeChild(currentMessage);
    }
  }
  else {
    // Create error message
    message = document.createElement('p');
    message.className = 'form--alert';
    message.setAttribute('role', 'alert');
    message.setAttribute('for', target.id);
    message.textContent = validation;

    // Check to see if there is a current alert message for this input
    if (!message.isEqualNode(currentMessage)) {
      // Set element to invalid
      target.setAttribute('aria-invalid', 'true');

      if (parent.nodeName.toLowerCase() !== 'fieldset') {
        // If parent isn't a fieldset, add message before first child
        insertRef = parent.firstChild;
        parent.insertBefore(message, insertRef);
      }
      else {
        // If parent is a fieldset, add message after either the description, if it exists, or the legend
        insertRef = parent.querySelector('.form--description') || parent.querySelector('legend');
        parent.insertBefore(message, insertRef.nextSibling);
      }
    }
  }
};

// Add Document Event Listener
document.addEventListener('DOMContentLoaded', function () {
  // Get all elements so we don't need to constantly read from the DOM
  Object.keys(allIDs).forEach(function (id) {
    allIDs[id] = document.getElementById(id);
  });

  // Add all event listeners
  Object.keys(allInputs).forEach(function (id) {
    allIDs[id].addEventListener(allInputs[id].validation.on, validate);
  });
});`;

    s._read = function read() {};

    // s.push(test);
    s.push(validation);
    s.push(null);

    b.add(s);
    b.bundle((err, file) => {
      if (err) {
        rej(err);
      }

      res(file.toString());
    });
  });
};

module.exports = rendered;
