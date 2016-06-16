const validation = require('./lib/validation.js');

module.exports = {
  name: 'Text Blocks',
  description: 'Add blocks of text that are very long',
  validation: {
    codeSnippetValidation: validation,
    snarkyRantValidation: validation,
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
    snarkyRant: {
      validation: {
        function: 'snarkyRantValidation',
        on: 'blur',
      },
      label: 'Snarky Rant',
      type: 'textarea',
      settings: {
        empty: false,
      },
    },
  },
  html: '<label for="{{codeSnippet.id}}">{{codeSnippet.label}}<textarea type="{{codeSnippet.type}}" id="{{codeSnippet.id}}" name="{{codeSnippet.name}}">{{codeSnippet.value}}</textarea></label><label for="{{snarkyRant.id}}">{{snarkyRant.label}}<textarea type="{{snarkyRant.type}}" id="{{snarkyRant.id}}" name="{{snarkyRant.name}}">{{snarkyRant.value}}</textarea></label>',
};
