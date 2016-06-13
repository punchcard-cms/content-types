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
  html: `<label for="{{radioSelector.id}}">{{radioSelector.label}}</label>{% for option in radioSelector.options %}<label><input type="{{radioSelector.type}}" name={{radioSelector.name}} id="{{radioSelector.id}}" value="{{radioSelector.value}}" {% if option.value == radioSelector.value %}checked{% endif %}>{{option.label}}</label>{% endfor %}`,
};