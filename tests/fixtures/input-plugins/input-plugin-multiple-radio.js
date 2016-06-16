const validation = require('./lib/validation.js');

module.exports = {
  name: 'Radio Selector',
  description: 'Select a radio option',
  validation: {
    radioValidation: validation,
    botsValidation: validation,
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
    radioBots: {
      validation: {
        function: 'botsValidation',
        on: 'blur',
      },
      label: 'Select a bot',
      type: 'radio',
      options: [
        { label: 'Optimus',
          value: 'opty',
        },
        { label: 'Hot Rod',
          value: 'rod',
        },
        { label: 'Alpha',
          value: 'alf',
        },
        { label: 'Nova',
          value: 'novvy',
        },
      ],
      settings: {
        empty: false,
      },
    },
  },
  html: `{% for option in radioSelector.options %}<label for="{{radioSelector.id}}--{{option.index}}"><input type="{{radioSelector.type}}" name="{{radioSelector.name}}" id="{{radioSelector.id}}--{{option.index}}" value="{{option.value}}" {% if option.value == radioSelector.value %}checked{% endif %}>{{option.label}}</label>{% endfor %}{% for option in radioBots.options %}<label for="{{radioBots.id}}--{{option.index}}"><input type="{{radioBots.type}}" name="{{radioBots.name}}" id="{{radioBots.id}}--{{option.index}}" value="{{option.value}}" {% if option.value == radioBots.value %}checked{% endif %}>{{option.label}}</label>{% endfor %}`,
};
