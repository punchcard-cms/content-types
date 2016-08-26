
'use strict';

/**
 * Local Input Plugin
 *
 *
 * An input plugin for testing local plugin ingestion
 */
const validation = require('./lib/validation.js');

/**
 * Local Input Plugin
 * @module localInputPlugin
 */
module.exports = {
  name: 'Local',
  description: 'An input plugin that resides locally',
  validation: {
    localValidation: validation,
  },
  inputs: {
    local: {
      validation: {
        function: 'localValidation',
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
  html: '<label for="{{local.id}}">{{local.label}}</label><input type="{{local.type}}" id="{{local.id}}" name="{{local.name}}" value="{{local.value}}" placeholder="{{local.placeholder}}" />',
};
