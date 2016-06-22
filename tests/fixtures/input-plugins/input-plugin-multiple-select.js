const validation = require('./lib/validation.js');

module.exports = {
  name: 'Kitten Name Selector',
  description: 'Select a kitten name',
  validation: {
    kittenNameSelectorValidation: validation,
    puppyNameSelectorValidation: validation,
  },
  inputs: {
    kittenNameSelector: {
      validation: {
        function: 'kittenNameSelectorValidation',
        on: 'blur',
      },
      label: 'Choose a kitten name',
      options: [
        { label: 'Michaelangelo',
          value: 'mike',
        },
        { label: 'Leonardo',
          value: 'leo',
        },
        { label: 'Raphael',
          value: 'ralph',
        },
        { label: 'Donatello',
          value: 'don',
        },
        { label: 'Muffins',
          value: 'muffy',
        },
        { label: 'Jeff',
          value: 'jeff',
        },
      ],
      type: 'select',
      settings: {
        empty: false,
      },
    },
    puppyNameSelector1: {
      validation: {
        function: 'puppyNameSelectorValidation',
        on: 'blur',
      },
      label: 'Choose a puppy name version 1',
      options: [
        { label: 'Tinky Winky',
          value: 'tink',
        },
        { label: 'Dipsy',
          value: 'dip',
        },
        { label: 'Laa-Laa',
          value: 'la',
        },
        { label: 'Po',
          value: 'po',
        },
        { label: 'Brownie',
          value: 'bro',
        },
        { label: 'Kevin',
          value: 'kev',
        },
      ],
      type: 'select',
      settings: {
        empty: false,
      },
    },
    puppyNameSelector2: {
      validation: {
        function: 'puppyNameSelectorValidation',
        on: 'blur',
      },
      label: 'Choose a puppy name version 2',
      options: [
        { label: 'Tinky Winky',
          value: 'tink',
        },
        { label: 'Dipsy',
          value: 'dip',
        },
        { label: 'Laa-Laa',
          value: 'la',
        },
        { label: 'Po',
          value: 'po',
        },
        { label: 'Brownie',
          value: 'bro',
        },
        { label: 'Kevin',
          value: 'kev',
        },
      ],
      type: 'select',
      settings: {
        empty: false,
      },
    },
  },
    html: `<label for="{{kittenNameSelector.id}}">{{kittenNameSelector.label}}</label>
      <select id="{{kittenNameSelector.id}}" name="{{kittenNameSelector.name}}">{% for option in select.options %}<option value="{{option.value}}" {% if option.value == select.value %}selected{% endif %}>{{option.label}}</option>{% endfor %}</select>
      <label for="{{puppyNameSelector1.id}}">{{puppyNameSelector1.label}}</label>
      <select id="{{puppyNameSelector1.id}}" name="{{puppyNameSelector1.name}}">{% for option in select.options %}<option value="{{option.value}}" {% if option.value == select.value %}selected{% endif %}>{{option.label}}</option>{% endfor %}</select>
      <label for="{{puppyNameSelector2.id}}">{{puppyNameSelector2.label}}</label>
      <select id="{{puppyNameSelector2.id}}" name="{{puppyNameSelector2.name}}">{% for option in select.options %}<option value="{{option.value}}" {% if option.value == select.value %}selected{% endif %}>{{option.label}}</option>{% endfor %}</select>`,
};
