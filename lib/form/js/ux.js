/* eslint-env browser */
/* global allPlugins, allInputs, allSettings, allIDs */

// TODO: Add In-Browser Tests
(function formUX() {
  'use strict';

  var script = function uxScript(target) {
    var inp = allInputs[target.id],
        input = {},
        settings = {};

    // Set up script input
    input.target = target;
    input.parent = target.parentNode;
    input.all = {};
    input.all[inp.name] = target;

    // Set up script settings
    settings.target = inp.settings;
    settings.all = {};
    settings.all[inp.name] = inp.settings;

    // Set all sibling input and settings
    Object.keys(inp.siblings).forEach(function uxSiblings(sibling) {
      input.all[sibling] = allIDs[inp.siblings[sibling]];
      settings.all[sibling] = allSettings[inp.parent.id][sibling];
    });

    // Run the script
    allPlugins[inp.parent.type].scripts[inp.script.function](input, settings);
  };

  // Call script for each input
  Object.keys(allInputs).forEach(function uxAttach(id) {
    if (allInputs[id].hasOwnProperty('script')) {
      script(allIDs[id]);
    }
  });
}());
