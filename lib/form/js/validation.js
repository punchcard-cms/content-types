/* eslint-env browser */
/* global allPlugins, allInputs, allSettings, allIDs */

// TODO: Add In-Browser Tests
(function formValidation() {
  'use strict';

  var valueCheck = function valueCheck(input, settings, validation) {
    if (input.target.required && (input.target.required === 'save' || input.target.required === 'publish') && input.target.value === '') {
      return 'Field cannot be left blank!';
    }

    return validation(input, settings);
  };

  // Validation Function
  // Disabled one-var for better readability
  var validate = function validate(e) { // eslint-disable-line one-var
    var target = e.target,
        value = target.value,
        inp = allInputs[target.id],
        parent = allIDs[inp.parent.id],
        input = {},
        settings = {},
        validation = false,
        message,
        currentMessage = parent.querySelector('[role="alert"][for="' + target.id + '"]'),
        insertRef;

    // Set up validation input
    input.target = {
      value: value,
      name: inp.name,
      required: inp.required,
    };
    input.all = {};
    input.all[inp.name] = value;

    // Set up validation settings
    settings.target = inp.settings;
    settings.all = {};
    settings.all[inp.name] = inp.settings;

    // Set all sibling input and settings
    Object.keys(inp.siblings).forEach(function validateSiblings(sibling) {
      input.all[sibling] = allIDs[inp.siblings[sibling]].value;
      settings.all[sibling] = allSettings[inp.parent.id][sibling];
    });

    // Run the validation
    validation = valueCheck(input, settings, allPlugins[inp.parent.type].validation[inp.validation.function]);

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

  // Add all event listeners
  Object.keys(allInputs).forEach(function validateAttach(id) {
    allIDs[id].addEventListener(allInputs[id].validation.on, validate);
  });
}());
