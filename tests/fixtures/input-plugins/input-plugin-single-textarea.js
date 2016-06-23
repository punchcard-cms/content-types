const validation = require('./lib/validation.js');

module.exports = {
  name: 'Code Snippet',
  description: 'Add code snippet for your cool doohickey',
  validation: {
    codeSnippetValidation: validation,
  },
  inputs: {
    codeSnippet: {
      validation: {
        function: 'codeSnippetValidation',
        on: 'blur',
      },
      label: 'Code Snippet',
      type: 'textarea',
      settings: {
        empty: false,
      },
    },
  },
  html: '<label for="{{codeSnippet.id}}">{{codeSnippet.label}}<textarea type="{{codeSnippet.type}}" id="{{codeSnippet.id}}" name="{{codeSnippet.name}}">{{codeSnippet.value}}</textarea></label>',
};