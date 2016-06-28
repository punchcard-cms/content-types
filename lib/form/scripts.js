'use strict';

const browserify = require('browserify');
const stream = require('stream');

const rendered = (type) => {
  return new Promise((res, rej) => {
    const b = browserify();
    const s = new stream.Readable();

    const scriptFunctions = {};
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
      scriptFunctions[plugin] = `input-plugin-${plugin}`;
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
        inputs[inp.id].script = inp.script;
        inputs[inp.id].settings = {};
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

    const scripts = `
var allScripts = ${JSON.stringify(scriptFunctions)};
var allInputs = ${JSON.stringify(inputs)};
var allSettings = ${JSON.stringify(allSettings)};
var allIDs = ${JSON.stringify(ids)};

// Work those requires
Object.keys(allScripts).forEach(function(plugin) {
  var plug = require(allScripts[plugin]);

  // Require the script from the inputs
  allScripts[plugin] = plug.scripts;
});

// Script Function
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
  script = allScripts[inp.parent.type][inp.script.function](input, settings);

};

// Add Document Event Listener
document.addEventListener('DOMContentLoaded', function () {
  // Get all elements so we don't need to constantly read from the DOM
  Object.keys(allIDs).forEach(function (id) {
    allIDs[id] = document.getElementById(id);
  });

  // Add all event listeners
  Object.keys(allInputs).forEach(function (id) {
    if (allInputs[id].hasOwnProperty('script')) {
      allIDs[id].addEventListener(allInputs[id].script.on, script);
    }
  });
});`;
    s._read = function read() {};

    s.push(scripts);
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
