const validation = require('./lib/validation.js');

module.exports = {
  name: 'Checkbox Selector',
  description: 'Select items',
  validation: {
    botsValidation: validation,
    selecticonValidation: validation,
    codeSnippetValidation: validation,
    kittenNameSelectorValidation: validation,
  },
  inputs: {
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
  },
  html: `{% if checkboxSelecticon.options.length > 1 %}<fieldset id="{{checkboxSelecticon.id}}"><legend>{{checkboxSelecticon.label}}</legend>{% endif %}
    {% for option in checkboxSelecticon.options %}<label for="{{checkboxSelecticon.id}}--{{option.index}}">
      <input type="{{checkboxSelecticon.type}}" name="{{checkboxSelecticon.name}}" id="{{checkboxSelecticon.id}}--{{option.index}}" value="{{option.value}}" {% if option.value == checkboxSelecticon.value %}checked{% endif %}>{{option.label}}</label>
    {% endfor %}
    {% if checkboxSelecticon.options.length > 1 %}</fieldset>{% endif %}
    {% if radioBots.options.length > 1 %}<radiogroup>{% endif %}
    {% for option in radioBots.options %}<label for="{{radioBots.id}}--{{option.index}}"><input type="{{radioBots.type}}" name="{{radioBots.name}}" id="{{radioBots.id}}--{{option.index}}" value="{{option.value}}" {% if option.value == radioBots.value %}checked{% endif %}>{{option.label}}</label>{% endfor %}
    {% if radioBots.options.length > 1 %}</radiogroup>{% endif %}
    <label for="{{codeSnippet.id}}">{{codeSnippet.label}}<textarea type="{{codeSnippet.type}}" id="{{codeSnippet.id}}" name="{{codeSnippet.name}}">{{codeSnippet.value}}</textarea></label>
    <label for="{{kittenNameSelector.id}}">{{kittenNameSelector.label}}</label><select id="{{kittenNameSelector.id}}" name="{{kittenNameSelector.name}}">{% for option in select.options %}<option value="{{option.value}}" {% if option.value == select.value %}selected{% endif %}>{{option.label}}</option>{% endfor %}</select></label>
  `,
};
