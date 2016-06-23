const validation = require('./lib/validation.js');

module.exports = {
  name: 'Checkbox Selector',
  description: 'Select items',
  validation: {
    checkboxValidation: validation,
    selecticonValidation: validation,
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
    checkboxSelecticon: {
      validation: {
        function: 'selecticonValidation',
        on: 'blur',
      },
      label: 'Select robots',
      type: 'checkbox',
      options: [
        { label: 'Megatron',
          value: 'mega',
        },
        { label: 'Starscream',
          value: 'star',
        },
        { label: 'Shockwave',
          value: 'shock',
        },
        { label: 'Galvatron',
          value: 'gal',
        },
      ],
      settings: {
        empty: false
      },
    },
  },
  html: `{% if checkboxSelector.options.length > 1 %}<fieldset id="{{checkboxSelector.id}}"><legend>{{checkboxSelector.label}}</legend>{% endif %}
    {% for option in checkboxSelector.options %}<label for="{{checkboxSelector.id}}--{{option.index}}">
      <input type="{{checkboxSelector.type}}" name="{{checkboxSelector.name}}" id="{{checkboxSelector.id}}--{{option.index}}" value="{{option.value}}" {% if option.value == checkboxSelector.value %}checked{% endif %}>{{option.label}}</label>
    {% endfor %}
    {% if checkboxSelector.options.length > 1 %}</fieldset>{% endif %}
    {% if checkboxSelecticon.options.length > 1 %}<fieldset id="{{checkboxSelecticon.id}}"><legend>{{checkboxSelecticon.label}}</legend>{% endif %}
    {% for option in checkboxSelecticon.options %}<label for="{{checkboxSelecticon.id}}--{{option.index}}">
      <input type="{{checkboxSelecticon.type}}" name="{{checkboxSelecticon.name}}" id="{{checkboxSelecticon.id}}--{{option.index}}" value="{{option.value}}" {% if option.value == checkboxSelecticon.value %}checked{% endif %}>{{option.label}}</label>
    {% endfor %}
    {% if checkboxSelecticon.options.length > 1 %}</fieldset>{% endif %}`,
};
