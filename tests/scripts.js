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
        id: 'something-new',
        inputs: {
          checkbox: {
            id: '5ba58361-87b7-4e79-8ea0-e54635ad23bb',
            label: 'SOme New THING',
            name: 'something-new--text',
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
        name: 'SOme New THING',
        type: 'checkbox',
        validation: 'validation',
      },
    ],
  };
  let expected = 'var allIDs = {"something-new":"something-new","5ba58361-87b7-4e79-8ea0-e54635ad23bb--1":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--1","5ba58361-87b7-4e79-8ea0-e54635ad23bb--2":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--2","5ba58361-87b7-4e79-8ea0-e54635ad23bb--3":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--3","5ba58361-87b7-4e79-8ea0-e54635ad23bb--4":"5ba58361-87b7-4e79-8ea0-e54635ad23bb--4"};';
  expected = 'allIDs';

  return rendered(type)
    .then(result => {
      t.true(includes(result, expected, 'allIds contains checkboxes'));
    });
});
