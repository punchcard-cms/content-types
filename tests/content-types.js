import test from 'ava';
import types from '../lib/content-types';

test('Content Types', t => {
  return types.only('bar', {
    'my-textarea': {
      textarea: {
        value: 'Hello World I am here',
      },
    },
  }).then(() => {
    // console.log(util.inspect(result, false, null));
    // fs.writeFileSync('fixtures/output.js', JSON.stringify(result, null, 2));
    t.pass();
  });
});

//////////////////////////////
// types() promise
//////////////////////////////
test('merged', t => {
  return types()
    .then(result => {
      t.is(result[0].name, 'Content Type BAR', 'Get first content type name');
      t.is(result[0].description, 'Bar Baz Foo', 'Get first content type desc');
      t.is(result[0].id, 'bar', 'Get first content type id');
      t.is(result[0].identifier, 'something-new', 'Get first content type identifier');
      t.is(result[1].name, 'Basic Content Type', 'Get second content type name');
      t.is(result[1].description, 'A very basic configuration', 'Get second content type desc');
      t.is(result[1].id, 'basic', 'Get second content type id');
      t.is(result[1].identifier, 'text', 'Get second content type identifier');
      t.is(result[2].name, 'Content Type Baz', 'Get second content type name');
      t.is(result[2].description, 'Bar Baz Foo', 'Get second content type desc');
      t.is(result[2].id, 'baz', 'Get second content type id');
      t.is(result[2].identifier, 'plugin-required-save', 'Get second content type identifier');
      t.is(result[3].name, 'Content Type FOO', 'Get third content type name');
      t.is(result[3].description, 'Foo Bar Baz', 'Get third content type desc');
      t.is(result[3].id, 'foo', 'Get third content type id');
      t.is(result[3].identifier, 'new-text-thing', 'Get third content type identifier');
    });
});

test('reject when something other than array is passed in', t => {
  const testCT = {
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'input-plugin-text',
        id: 'text',
        name: 'Text',
      },
    ],
  };

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Content types must be an array', 'Non-Array Rejected');
  });
});

test('reject when same attribute ids', t => {
  const testCT = {
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        id: 'text',
        name: 'Text',
      },
      {
        type: 'text',
        id: 'text',
        name: 'Text',
      },
    ],
  };

  return types([testCT]).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input ID \'text\' in content type \'Foo\' cannot be duplicated (in \'Text\')', 'Dupe ids Rejected');
  });
});

test('reject when content type config has issues', t => {
  return types([{}]).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Content types require a name', 'Triggers config check');
  });
});

test('reject when plugin not found', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'input-plugin-text',
        id: 'text',
        name: 'Text',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'input-plugin-text\' not found', 'Missing Plugin');
  });
});

test('reject when identifier is mutli-input', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    identifier: 'quote',
    attributes: [
      {
        type: 'quote',
        id: 'quote',
        name: 'Quote',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier quote in content type \'Foo\' has more than one input. Only single-input attributes may be the identifier.', 'Identifier only allowed one input');
  });
});

test('reject when identifier is repeatable', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    identifier: 'text',
    attributes: [
      {
        type: 'text',
        id: 'text',
        name: 'Text',
        repeatable: true,
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Identifier text in content type \'Foo\' is repeatable. Only non-repeatable attributes may be the identifier.', 'Identifier cannot be repeatable');
  });
});

test('reject when all identifiers are mutli-input', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'quote',
        id: 'quote',
        name: 'Quote',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Content type \'Foo\' does not have an attribute which can be an identifier.', 'Identifier only allowed one input');
  });
});

test('reject when identifier is repeatable', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        id: 'text',
        name: 'Text',
        repeatable: true,
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Content type \'Foo\' does not have an attribute which can be an identifier.', 'Identifier only allowed one input');
  });
});


test('merged with correct param', t => {
  const testCT = {
    name: 'FooRific',
    description: 'A very foo content model.',
    id: 'foo-rific',
    attributes: [
      {
        type: 'text',
        id: 'username',
        name: 'Username',
        repeatable: {},
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
      t.is(merged.identifier, 'full-name', 'Content type identifier is automatically selected');
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

//////////////////////////////
// content-type names
//////////////////////////////
test('get content types names', t => {
  const ctypes = [
    {
      name: 'Content Type BAR',
      description: 'Bar Baz Foo',
      id: 'bar',
    },
    {
      name: 'Content Type Baz',
      description: 'Bar Baz Foo',
      id: 'baz',
    },
    {
      name: 'Content Type FOO',
      description: 'Foo Bar Baz',
      id: 'foo',
    },
  ];

  const names = types.raw.names(ctypes);
  t.is(names[0], 'Content Type BAR', 'Should have name');
  t.is(names[1], 'Content Type Baz', 'Should have name');
  t.is(names[2], 'Content Type FOO', 'Should have name');
});

//////////////////////////////
// content-type attributes
//////////////////////////////
test('get attributes - bad', t => {
  const bad = [
    {
      name: 'Content Type BAR',
      description: 'Bar Baz Foo',
      id: 'bar',
      attributes: '',
    },
    {
      name: 'Content Type Baz',
      description: 'Bar Baz Foo',
      id: 'baz',
    },
    {
      name: 'Content Type FOO',
      description: 'Foo Bar Baz',
      id: 'foo',
      attributes: [],
    },
  ];
  let attrs = types.raw.attributes('bar', bad);
  t.false(attrs, 'Wrong type attributes should return false');

  attrs = types.raw.attributes('baz', bad);
  t.false(attrs, 'Missing attributes should return false');

  attrs = types.raw.attributes('foo', bad);
  t.false(attrs, 'Empty attributes should return false');
});

test('get attributes of one type', t => {
  return types()
    .then(result => {
      const attrs = types.raw.attributes('bar', result);
      t.is(result[0].attributes, attrs, 'Should get the attributes object of one type');
    });
});
