
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
  html: '<label for="{{text.id}}">{{text.label}}</label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />',
};
