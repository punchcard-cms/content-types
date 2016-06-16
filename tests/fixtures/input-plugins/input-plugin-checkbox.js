const validation = require('./lib/validation.js');

module.exports = {
  name: 'Checkbox Selector',
  description: 'Select items',
  validation: {
    checkboxValidation: validation,
  },
  inputs: {
    checkboxSelector: {
      validation: {
        function: 'checkboxValidation',
        on: 'blur',
      },
      label: 'Select items',
      type: 'checkbox',
      options: [
        { label: 'red',
          value: 'red',
        },
        { label: 'blue',
          value: 'blue',
        },
        { label: 'green',
          value: 'green',
        },
        { label: 'yellow',
          value: 'yellow',
        },
      ],
      settings: {
        empty: false
      },
    },
  },
  html: `<label for="{{checkboxSelector.id}}">{{checkboxSelector.label}}</label>{% for option in checkboxSelector.options %}<label><input type="{{checkboxSelector.type}}" name={{checkboxSelector.name}} id="{{checkboxSelector.id}}" value="{{checkboxSelector.value}}" {% if option.value == checkboxSelector.value %}checked{% endif %}>{{option.label}}</label>{% endfor %}`,
};