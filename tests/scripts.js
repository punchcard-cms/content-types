import test from 'ava';
import includes from 'lodash/includes';
import rendered from '../lib/form/scripts.js';

test('Checkbox ids in browser scripts', t => {
  const type = {
    id: 'bar',
    desciption: 'Bar Baz Foo',
    name: 'Checkbox test',
    attributes: [
      {
        description: 'I am the Bar Content Type Config text field description',
        html: '{% for option in checkbox.options %}<label for="{{checkbox.id}}--{{loop.index}}"><input type="{{checkbox.type}}" name="{{checkbox.name}}" id="{{checkbox.id}}--{{loop.index}}" value="{{option.value}}" {% if checkbox.value %}{% if option.value == checkbox.value %}checked{% endif %}{% endif %}>{{option.label}}</label>{% endfor %}',
        id: 'checkbox-attr-1',
        name: 'Checkbox Attr 1',
        type: 'checkbox',
        validation: 'validation',
        inputs: {
          checkbox: {
            id: '5ba58361-87b7-4e79-8ea0-e54635ad23bb',
            label: 'Checkbox Foo',
            name: 'checkbox-foo--text',
            placeholder: 'Text Goes Here',
            settings: {
              empty: true,
            },
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
            validation: {
              function: 'checkboxValidation',
              on: 'change',
            },
          },
        },
      },
      {
        name: 'Feature Name',
        description: 'Name of Feature (ex. Image Tagging or Free Plan)',
        validation: {},
        repeatable: {
          min: 1,
          max: 21,
        },
        inputs: [
          {
            text: {
              validation: {
                function: 'textValidation',
                on: 'blur',
              },
              label: 'Feature Name',
              placeholder: 'Feature Name',
              type: 'text',
              id: '98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--0',
              name: 'title--text--0',
              value: 'rewr',
            },
          },
          {
            text: {
              validation: {
                function: 'textValidation',
                on: 'blur',
              },
              label: 'Feature Name',
              placeholder: 'Feature Name',
              type: 'text',
              id: '98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--1',
              name: 'title--text--1',
              value: 'rewaqr',
            },
          },
          {
            text: {
              validation: {
                function: 'textValidation',
                on: 'blur',
              },
              label: 'Feature Name',
              placeholder: 'Feature Name',
              type: 'text',
              id: '98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--2',
              name: 'title--text--2',
              value: 'fdasfsdf',
            },
          },
        ],
        html: '<label for=\'{{text.id}}\'>{{text.label}}</label><input type=\'{{text.type}}\' id=\'{{text.id}}\' name=\'{{text.name}}\' value=\'{{text.value}}\' placeholder=\'{{text.placeholder}}\' />',
        id: 'featured-name',
        type: 'text',
      },
      {
        html: '<label for=\'{{text.id}}\'>{{text.label}}</label><input type=\'{{text.type}}\' id=\'{{text.id}}\' name=\'{{text.name}}\' value=\'{{text.value}}\' placeholder=\'{{text.placeholder}}\' />',
        id: 'text-attr-1',
        name: 'Text Attr 1',
        type: 'text',
        validation: 'validation',
        repeatable: {
          min: 1,
          max: 15,
        },
        inputs: {
          text: {
            id: '5ba58361-87b7-4e79-8ea0-e54635ad23ba',
            label: 'Repeater Test',
            name: 'repeater-test--text',
            placeholder: 'Text Goes Here',
            settings: {
              empty: true,
            },
            type: 'text',
            validation: {
              function: 'textValidation',
              on: 'change',
            },
          },
        },
      },
      {
        html: '<label for=\'{{text.id}}\'>{{text.label}}</label><input type=\'{{text.type}}\' id=\'{{text.id}}\' name=\'{{text.name}}\' value=\'{{text.value}}\' placeholder=\'{{text.placeholder}}\' />',
        id: 'text-attr-2',
        name: 'Text Attr 2',
        type: 'text',
        validation: 'validation',
        inputs: {
          texta: {
            id: '5ba58361-87b7-4e79-8ea0-e54635ad23ba',
            label: 'Sibling Test A',
            name: 'sibling-test-a--text',
            placeholder: 'Text Goes Here',
            settings: {
              empty: true,
            },
            type: 'text',
            validation: {
              function: 'textValidation',
              on: 'change',
            },
          },
          textb: {
            id: '5ba58361-87b7-4e79-8ea0-e54635ad23bb',
            label: 'Sibling Test B',
            name: 'sibling-test-b--text',
            placeholder: 'Text Goes Here',
            options: ['foo', ''],
            type: 'checkbox',
            validation: {
              function: 'textValidation',
              on: 'change',
            },
          },
        },
      },
    ],

  };
  const ids = 'var allIDs = {"checkbox-attr-1":"checkbox-attr-1","5ba58361-87b7-4e79-8ea0-e54635ad23bb--1":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--1","5ba58361-87b7-4e79-8ea0-e54635ad23bb--2":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--2","5ba58361-87b7-4e79-8ea0-e54635ad23bb--3":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--3","5ba58361-87b7-4e79-8ea0-e54635ad23bb--4":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--4","featured-name":"featured-name","98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--0":"98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--0","98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--1":"98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--1","98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--2":"98d21880-5ded-4e2f-a1b2-35cb0cb5a61c--2","text-attr-1":"text-attr-1","5ba58361-87b7-4e79-8ea0-e54635ad23ba":"5ba58361-87b7-4e79-8ea0-e54635ad23ba","text-attr-2":"text-attr-2"};';
  const repeaters = {
    'featured-name': {
      'min': 1,
      'max': 21,
      'length': 3,
    },
    'text-attr-1': {
      'min': 1,
      'max': 15,
      'length': 1,
    },
  };

  return rendered(type)
    .then(result => {
      t.true(includes(result, ids, 'allIds contains checkboxes'));
      t.true(includes(result, JSON.stringify(repeaters), 'allIds contains checkboxes'));
    });
});
