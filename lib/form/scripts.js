'use strict';

const browserify = require('browserify');
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const globalConfig = require('config');
const formJS = fs.readdirSync(path.join(__dirname, 'js')).map(script => {
  return fs.readFileSync(path.join(__dirname, 'js', script));
}).join('\n\n');

// const util = require('../util');

const rendered = (type) => {
  return new Promise((res, rej) => {
    const b = browserify();
    const s = new stream.Readable();
    const allPlugins = {};
    const allSettings = {};
    const inputs = {};
    const dir = _.get(globalConfig, '.content.plugins.directory', []);
    const ids = {};
    let plugins = type.attributes.map(plugin => {
      return plugin.type;
    });
    const existingPlugins = {};
    dir.forEach((directory) => {
      fs.readdirSync(directory).forEach((file) => {
        if (file.indexOf('input-plugin') >= 0 && !existingPlugins.hasOwnProperty(file)) {
          existingPlugins[file] = path.join(directory, file);
        }
      });
    });

    plugins = plugins.filter((item, pos, self) => {
      return self.indexOf(item) === pos;
    });

    plugins.forEach(plugin => {
      // Require Plugins for Browserify
      if (existingPlugins.hasOwnProperty(`input-plugin-${plugin}`)) {
        b.require(existingPlugins[`input-plugin-${plugin}`]);
        allPlugins[plugin] = existingPlugins[`input-plugin-${plugin}`];
      }
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
        if (inp.options && inp.type.toLowerCase() !== 'select') {
          inp.options.forEach((value, index) => {
            const formulatedId = `${inp.id}--${index + 1}`;

            // Build input object for this specific input
            inputs[formulatedId] = {};
            inputs[formulatedId].name = input;
            inputs[formulatedId].validation = inp.validation;
            inputs[formulatedId].script = inp.script;
            inputs[formulatedId].required = inp.required;
            inputs[formulatedId].settings = {};
            inputs[formulatedId].parent = {
              id: plugin.id,
              type: plugin.type,
            };
            inputs[formulatedId].siblings = {};

            if (inp.hasOwnProperty('settings')) {
              inputs[formulatedId].settings = inp.settings;
            }

            // Get IDs for all siblings
            siblings.forEach(sibling => {
              inputs[formulatedId].siblings[sibling] = plugin.inputs[sibling].id;
            });
            ids[formulatedId] = formulatedId;
          });
        }
        else {
          // Build input object for this specific input
          inputs[inp.id] = {};
          inputs[inp.id].name = input;
          inputs[inp.id].validation = inp.validation;
          inputs[inp.id].script = inp.script;
          inputs[inp.id].required = inp.required;
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
        }
      });
    });

    const formScript = `
var allPlugins = ${JSON.stringify(allPlugins)};
var allInputs = ${JSON.stringify(inputs)};
var allSettings = ${JSON.stringify(allSettings)};
var allIDs = ${JSON.stringify(ids)};

// Work those requires
Object.keys(allPlugins).forEach(function(plugin) {
  var plug = require(allPlugins[plugin]);

  // Require the plugin
  allPlugins[plugin] = plug;
});


// Add Document Event Listener
document.addEventListener('DOMContentLoaded', function () {
  // Get all elements so we don't need to constantly read from the DOM
  Object.keys(allIDs).forEach(function (id) {
    allIDs[id] = document.getElementById(id);
  });

  // Inlcude all form scripts
  ${formJS}
});`;

    s._read = function read() {};

    s.push(formScript);
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
