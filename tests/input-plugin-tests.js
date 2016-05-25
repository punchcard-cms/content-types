import test from 'ava';
import config from 'config';
import plugin from '../lib/input-plugin-tests';

// const inputPluginMinimum = {
//   'label': 'Test Label Foo',
//   'html': 'Test HTML foo',
// }

const validation = function (input, settings) {
  return {
    input,
    settings
  }
};

const inputPluginSingle = {
  name: 'Email',
  description: 'Make sure email is good to go',
  validation: {
    emailValidation: validation,
  },
  inputs: {
    email: {
      validation: {
        function: 'emailValidation',
        on: 'blur',
      },
      label: 'Email',
      placeholder: 'Email',
      type: 'text',
      settings: {
        empty: false,
      },
    },
  },
  html: '<label for="{{email.id}}">{{email.label}}<input type="{{email.type}}" id="{{email.id}}" name="{{email.name}}" value="{{email.value}}" placeholder="{{email.placeholder}}" /></label>',
};

const inputPluginSingleTextarea = {
  name: 'Code Snippet',
  description: 'Add code snippet for your cool doohickey',
  validation: {
    codeSnippetValidation: validation,
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
  },
  html: '<label for="{{codeSnippet.id}}">{{codeSnippet.label}}<textarea type="{{codeSnippet.type}}" id="{{codeSnippet.id}}" name="{{codeSnippet.name}}">{{codeSnippet.value}}</textarea></label>',
};

const inputPluginSingleSelect = {
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

const inputPluginMultiple = {
  name: 'Email',
  description: 'Make sure email is good to go',
  validation: {
    emailValidation: validation,
    acceptValidation: validation,
  },
  inputs: {
    email: {
      validation: {
        function: 'emailValidation',
        on: 'blur',
      },
      label: 'Email',
      placeholder: 'Email',
      type: 'text',
      settings: {
        empty: false,
      },
    },
    accept: {
      validation: {
        function: 'emailValidation',
        on: 'change',
      },
      label: 'Accept',
      type: 'checkbox',
      settings: {
        empty: false,
      },
    },
  },
  html: '<label for="{{email.id}}">{{email.label}}<input type="{{email.type}}" id="{{email.id}}" name="{{email.name}}" value="{{email.value}}" placeholder="{{email.placeholder}}" /></label><label for="{{accept.id}}">{{accept.label}}<input type="{{accept.type}}" id="{{accept.id}}" name="{{accept.name}}" value="{{accept.value}}" />{{accept.label}}</label>',
};

const inputPluginMultipleTextareaSelect = {
  name: 'Email',
  description: 'Make sure email is good to go',
  validation: {
    kittenNameSelectorValidation: validation,
    codeSnippetValidation: validation,
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
  },
  html: '<label for="{{kittenNameSelector.id}}">{{kittenNameSelector.label}}<select id="{{kittenNameSelector.id}}" name="{{kittenNameSelector.name}}" value="{{kittenNameSelector.value}}">{% for name in kittenNameSelector.settings.name %}<option value="{{name}}">{{name}}</option>{% endfor %}</select></label><label for="{{codeSnippet.id}}">{{codeSnippet.label}}<textarea type="{{codeSnippet.type}}" id="{{codeSnippet.id}}" name="{{codeSnippet.name}}">{{codeSnippet.value}}</textarea></label>',
};

test('Input Plugin Tests Requires Test and Plugin', t => {
  let validated = false;
  if (plugin(false, inputPluginSingle) === 'you must include a test runner') {
    validated = true;
  }
  t.true(validated, 'A test runner must be parameter 1');

  validated = false;
  if (plugin(test, false) === 'you must include a plugin to test') {
    validated = true;
  }
  t.true(validated, 'The plugin must be parameter 2');

  validated = false;
  if (plugin(test, 'foo') === 'plugin must be an object') {
    validated = true;
  }
  t.true(validated, 'Plugin must be an object');
});

plugin(test, inputPluginSingle);

plugin(test, inputPluginSingleTextarea);

plugin(test, inputPluginSingleSelect);

plugin(test, inputPluginMultiple);

plugin(test, inputPluginMultipleTextareaSelect);
