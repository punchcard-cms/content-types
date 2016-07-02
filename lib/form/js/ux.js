/* eslint-env browser */
/* global allPlugins, allInputs, allSettings, allIDs */


(function formUX() {
  var script = function (e) {
    var target = e.target;
    var inp = allInputs[target.id];
    var input = {};
    var settings = {};

    // Set up script input
    input.target = target;
    input.all = {};
    input.all[inp.name] = target;

    // Set up script settings
    settings.target = inp.settings;
    settings.all = {};
    settings.all[inp.name] = inp.settings;

    // Set all sibling input and settings
    Object.keys(inp.siblings).forEach(function (sibling) {
      input.all[sibling] = allIDs[inp.siblings[sibling]];
      settings.all[sibling] = allSettings[inp.parent.id][sibling];
    });

    // Run the script
    script = allPlugins[inp.parent.type].scripts[inp.script.function](input, settings);

  };

  // Add all event listeners
  Object.keys(allInputs).forEach(function (id) {
    if (allInputs[id].hasOwnProperty('script')) {
      allIDs[id].addEventListener(allInputs[id].script.on, script);
    }
  });
}());
