const validation = require('./lib/validation.js');

module.exports = {
  name: 'Kitten Name Selector',
  description: 'Select a kitten name',
  validation: {
    kittenNameSelectorValidation: validation,
  },
  inputs: {
    kittenNameSelector: {
      validation: {
        function: 'kittenNameSelectorValidation',
        on: 'blur',
      },
      label: 'Choose a kitten name',
      type: 'select',
      settings: {
        empty: false,
        names: ['Michaelangelo', 'Leonardo', 'Raphael', 'Donatello', 'Muffins', 'Jeff']
      },
    },
  },
  html: `<label for="{{kittenNameSelector.id}}">{{kittenNameSelector.label}}<select id="{{kittenNameSelector.id}}" name="{{kittenNameSelector.name}}" value="{{kittenNameSelector.value}}">
    {% for name in kittenNameSelector.settings.name %}<option value="{{name}}" {% if name == kittenNameSelector.value %}selected{% endif %}>{{name}}</option>{% endfor %}
    </select></label>`,
};