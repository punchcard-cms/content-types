
'use strict';

/**
 * Core Input Plugin
 *
 *
 * An input plugin for testing core plugin ingestion
 */
const validation = require('./lib/validation.js');

/**
 * Core Input Plugin
 * @module coreInputPlugin
 */
module.exports = {
  name: 'Core',
  description: 'An input plugin that ships with core',
  validation: {
    coreValidation: validation,
  },
  inputs: {
    core: {
      validation: {
        function: 'coreValidation',
        on: 'change',
      },
      type: 'text',
      label: 'Add Your Text',
      placeholder: 'Text Goes Here',
      settings: {
        empty: true,
      },
    },
  },
  html: '<label for="{{core.id}}">{{core.label}}</label><input type="{{core.type}}" id="{{core.id}}" name="{{core.name}}" value="{{core.value}}" placeholder="{{core.placeholder}}" />',
};
