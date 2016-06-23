const validation = require('./lib/validation.js');

module.exports = {
  name: 'Radio Selector',
  description: 'Select a radio option',
  validation: {
    radioValidation: validation,
  },
  inputs: {
    radioSelector: {
      validation: {
        function: 'radioValidation',
        on: 'blur',
      },
      label: 'Select a radio',
      type: 'radio',
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
        empty: false,
      },
    },
  },
  html: `{% if radioSelector.options.length > 1 %}<radiogroup>{% endif %}
    {% for option in radioSelector.options %}<label for="{{radioSelector.id}}--{{option.index}}"><input type="{{radioSelector.type}}" name="{{radioSelector.name}}" id="{{radioSelector.id}}--{{option.index}}" value="{{option.value}}" {% if option.value == radioSelector.value %}checked{% endif %}>{{option.label}}</label>{% endfor %}
    {% if radioSelector.options.length > 1 %}</radiogroup>{% endif %}`,
};
