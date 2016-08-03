import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';
import types from '../lib/content-types';
import only from '../lib/content-types/only.js';
import barInput from './fixtures/objects//bar-input.js';
import barExpected from './fixtures/objects//bar-expected.js';

const correctCT = [{
  name: 'Foo',
  id: 'foo',
  identifier: 'my-text',
  attributes: [
    {
      type: 'text',
      name: 'My Text',
      id: 'my-text',
    },
    {
      type: 'email',
      name: 'My Email',
      id: 'my-email',
    },
    {
      type: 'quote',
      name: 'Quote',
      id: 'quote',
    },
    {
      type: 'checkbox',
      name: 'Checkbox',
      id: 'checkbox',
      inputs: {
        checkbox: {
          options: [
            {
              label: 'one',
              value: 'one',
            },
            {
              label: 'two',
              value: 'two',
            },
          ],
        },
      },
    },
  ],
}];

test('Content Types', t => {
  return only(barInput, {
    'something-new': {
      text: { value: 'foo' },
    },
    'my-quote': [
      {
        author: { value: 'bar' },
        quote: { value: 'foo' },
        source: { value: 'baz' },
      },
      {
        author: { value: 'bar1' },
        quote: { value: 'foo1' },
        source: { value: 'baz1' },
      },
      {
        author: { value: 'bar2' },
        quote: { value: 'foo2' },
        source: { value: 'baz2' },
      },
    ],
  }).then(result => {
    t.deepEqual(result, barExpected, 'Only method works!');
    t.pass();
  });
});

test('merged', t => {
  return types()
    .then(result => {
      t.is(result[0].name, 'Content Type BAR', 'Get first content type name');
      t.is(result[0].description, 'Bar Baz Foo', 'Get first content type desc');
      t.is(result[0].id, 'bar', 'Get first content type id');
      t.is(result[1].name, 'Content Type Baz', 'Get second content type name');
      t.is(result[1].description, 'Bar Baz Foo', 'Get second content type desc');
      t.is(result[1].id, 'baz', 'Get second content type id');
      t.is(result[2].name, 'Content Type FOO', 'Get third content type name');
      t.is(result[2].description, 'Foo Bar Baz', 'Get third content type desc');
      t.is(result[2].id, 'foo', 'Get third content type id');
    });
});

test('reject when something other than array is passed in', t => {
  return types(correctCT[0]).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Content types must be an array', 'Non-Array Rejected');
  });
});

test('reject when plugin not found', t => {
  const type = cloneDeep(correctCT);
  type[0].attributes[0].type = 'input-plugin-text';

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'input-plugin-text\' not found', 'Missing Plugin');
  });
});

test('reject when name not found - no id', t => {
  const type = cloneDeep(correctCT);
  delete type[0].attributes[0].name;
  delete type[0].attributes[0].id;

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'text\' in content type \'Foo\' needs a name', 'Missing Name');
  });
});

test('reject when name not found - id', t => {
  const type = cloneDeep(correctCT);
  delete type[0].attributes[0].name;
  type[0].attributes[0].id = 'My Text';

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'My Text\' in content type \'Foo\' needs a name', 'Missing Name');
  });
});

test('reject when id not found', t => {
  const type = cloneDeep(correctCT);
  delete type[0].attributes[0].id;

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'My Text\' in content type \'Foo\' needs an ID', 'Missing ID');
  });
});

test('reject when id is not kebab case', t => {
  const type = cloneDeep(correctCT);
  type[0].attributes[0].id = 'myText';

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input ID \'myText\' needs to be written in kebab case (e.g. \'my-text\')', 'Not Kebab ID');
  });
});

test('reject when id is duplicated', t => {
  const type = cloneDeep(correctCT);
  type[0].attributes[1].id = 'my-text';

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input ID \'my-text\' in content type \'Foo\' cannot be duplicated (in \'My Email\')', 'Duplicate id in attributes');
  });
});

test('reject when identifier missing', t => {
  const type = cloneDeep(correctCT);
  delete type[0].identifier;

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier missing in content type \'Foo\'', 'Identifier not in config');
  });
});

test('reject when identifier not a string', t => {
  const type = cloneDeep(correctCT);
  type[0].identifier = [];

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier in content type \'Foo\' must be a string', 'Identifier not string');
  });
});

test('Content Type config check identifier exists', t => {
  const type = cloneDeep(correctCT);
  type[0].identifier = 'sandwich';

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier \'sandwich\' is not an attribute in content type \'Foo\'.', 'Identifier must match an attribute');
  });
});

test('Content Type config check identifier input not multi', t => {
  const type = cloneDeep(correctCT);
  type[0].identifier = 'quote';

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier \'quote\' in content type \'Foo\' has more than one input. Only single-input attributes may be the identifier.', 'Identifier attr cannot have multiple inputs');
  });
});

test('reject when identifier is repeatable', t => {
  const type = cloneDeep(correctCT);
  type[0].attributes[0].repeatable = true;

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier \'my-text\' in content type \'Foo\' is repeatable. Only non-repeatable attributes may be the identifier.', 'Identifier cannot be repeatable');
  });
});

test('reject when identifier has options', t => {
  const type = cloneDeep(correctCT);
  type[0].identifier = 'checkbox';

  return types(type).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier \'checkbox\' in content type \'Foo\' has options. Attributes with options may not be the identifier.', 'Identifier cannot have options');
  });
});

test('merged with correct param', t => {
  const testCT = {
    name: 'FooRific',
    description: 'A very foo content model.',
    id: 'foo-rific',
    identifier: 'username',
    attributes: [
      {
        type: 'text',
        id: 'username',
        name: 'Username',
        description: 'Please enter a username',
      },
      {
        type: 'text',
        id: 'full-name',
        name: 'Full Name',
        description: 'Please enter your full name',
        inputs: {
          text: {
            label: 'Foo Bar Baz',
          },
        },
      },
      {
        type: 'selects-related',
        id: 'related-selects',
        name: 'Related Select Fields',
        description: 'Please choose wisely',
        inputs: {
          select1: {
            label: 'I am the first',
          },
          select2: {
            label: 'I am the second',
          },
        },
      },
    ],
  };

  return types([testCT])
    .then(result => {
      let input;
      const merged = result[0];

      t.is(result.length, 1, 'There is one result');

      t.is(merged.name, 'FooRific', 'Content type name does not change');
      t.is(merged.description, 'A very foo content model.', 'Content type description does not change');
      t.is(merged.id, 'foo-rific', 'Content type ID does not change');
      t.true(merged.hasOwnProperty('attributes'), 'Content type has attributes');
      t.is(merged.attributes.length, 3, 'Content type has three attributes');

      merged.attributes.forEach((attr, i) => {
        const base = testCT.attributes[i];

        t.is(attr.name, base.name, 'Attribute name does not change');
        t.is(attr.description, base.description, 'Attribute description does not change');
        t.is(attr.id, base.id, 'Attribute ID does not change');
        t.is(attr.type, base.type, 'Attribute type does not change');

        t.true(attr.hasOwnProperty('validation'), 'Attribute has validation');
        t.true(attr.hasOwnProperty('html'), 'Attribute has HTML');
        t.true(attr.hasOwnProperty('inputs'), 'Attribute has inputs');

        if (Object.keys(attr.inputs).length === 1) {
          input = Object.keys(attr.inputs)[0];

          if (base.hasOwnProperty('inputs')) {
            if (base.inputs.hasOwnProperty(input)) {
              if (base.inputs[input].hasOwnProperty('label')) {
                t.is(attr.inputs[input].label, base.inputs[input].label, 'Input label is used if present in base if one input');
              }
            }
          }
          else {
            t.is(attr.inputs[input].label, base.name, 'Input label is set to name if one input');
          }
        }

        if (attr === merged.attributes[2]) {
          input = Object.keys(attr.inputs);
          t.true(attr.inputs[input[0]].hasOwnProperty('script'), 'Attribute has scripts');
        }
      });
    });
});
