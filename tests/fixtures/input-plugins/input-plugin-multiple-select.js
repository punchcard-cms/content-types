const validation = require('./lib/validation.js');

module.exports = {
  name: 'Multiple Kitten Name Selector',
  description: 'Select a few kitten names',
  validation: {
    kittenNameMultipleSelectorValidation: validation,
  },
  inputs: {
    kittenNameSelector: {
      validation: {
        function: 'kittenNameMultipleSelectorValidation',
        on: 'blur',
      },
      label: 'Select a few kitten names',
      type: 'select',
      settings: {
        empty: false,
        multiple: true,
        names: ['Michaelangelo', 'Leonardo', 'Raphael', 'Donatello', 'Muffins', 'Jeff']
      },
    },
  },
  html: `<label for="{{kittenNameSelector.id}}">{{kittenNameSelector.label}}<select id="{{kittenNameSelector.id}}" name="{{kittenNameSelector.name}}" value="{{kittenNameSelector.value}}" {% if settings.multiple %}multiple="multiple"{% endif %}>
    {% for name in kittenNameSelector.settings.name %}<option value="{{name}}" {% if name == kittenNameSelector.value %}selected{% endif %}>{{name}}</option>{% endfor %}
    </select></label>`,
};