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
      t.is(result[1].name, 'Content Type Baz', 'Get second content type name');
      t.is(result[1].description, 'Bar Baz Foo', 'Get second content type desc');
      t.is(result[1].id, 'baz', 'Get second content type id');
      t.is(result[2].name, 'Content Type FOO', 'Get third content type name');
      t.is(result[2].description, 'Foo Bar Baz', 'Get third content type desc');
      t.is(result[2].id, 'foo', 'Get third content type id');
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

test('reject when name not found - no id', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'text\' in content type \'Foo\' needs a name', 'Missing Name');
  });
});

test('reject when name not found - id', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        id: 'My Text',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'My Text\' in content type \'Foo\' needs a name', 'Missing Name');
  });
});

test('reject when id not found', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        name: 'My Text',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'My Text\' in content type \'Foo\' needs an ID', 'Missing ID');
  });
});

test('reject when id is not kebab case', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        name: 'My Text',
        id: 'myText',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input ID \'myText\' needs to be written in kebab case (e.g. \'my-text\')', 'Not Kebab ID');
  });
});

test('reject when id is duplicated', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        name: 'My Text',
        id: 'my-text',
      },
      {
        type: 'email',
        name: 'My Email',
        id: 'my-text',
      },
    ],
  }];

  return types(testCT).then(() => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input ID \'my-text\' in content type \'Foo\' cannot be duplicated (in \'My Email\')', 'No Duplicate IDs');
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

//////////////////////////////
// check content-type configuration
//////////////////////////////
test('configuration check - object', t => {
  const type = 'foo';

  const result = types.raw.check(type);
  t.is(result, 'Type must be an object', 'Should be an object');
});

test('configuration check - name', t => {
  const type = {};

  let result = types.raw.check(type);
  t.is(result, 'Content types require a name', 'Should have a name');

  type.name = '';
  result = types.raw.check(type);
  t.is(result, 'Content types require a name', 'Should have a name');
});

test('configuration check - name/string', t => {
  const type = {
    name: 123,
  };

  let result = types.raw.check(type);
  t.is(result, 'Content type name must be string', 'Name should be a string');

  type.name = [];
  result = types.raw.check(type);
  t.is(result, 'Content type name must be string', 'Name should be a string');
});

test('configuration check - id', t => {
  const type = {
    name: 'foo',
  };

  let result = types.raw.check(type);
  t.is(result, 'Content types require an id', 'Should have an id');

  type.id = '';
  result = types.raw.check(type);
  t.is(result, 'Content types require an id', 'Should have an id');
});

test('configuration check - id/string', t => {
  const type = {
    name: 'foo',
    id: 123,
  };

  let result = types.raw.check(type);
  t.is(result, 'Content type id must be string', 'ID should be a string');

  type.id = [];
  result = types.raw.check(type);
  t.is(result, 'Content type id must be string', 'ID should be a string');
});

test('configuration check - id/kebab', t => {
  const type = {
    name: 'foo',
    id: 'FooFoo',
  };

  const result = types.raw.check(type);
  t.is(result, 'FooFoo needs to be written in kebab case (e.g. foofoo)', 'ID should be kebab');
});

test('Content Type check attributes exists', t => {
  const type = {
    name: 'Foo',
    id: 'foo',
  };
  const check = types.raw.check(type);
  t.is(check, 'A content type must have attributes', 'A Content Type must have attributes');
});

test('Content Type attributes is an array', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: 'attributes',
  };
  const check = types.raw.check(type);
  t.is(check, 'Content type attributes must be an array', 'Content Type attributes must be an array');
});

test('Content Type - at least one attribute', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [],
  };
  const check = types.raw.check(type);
  t.is(check, 'Content type must have at least one attribute', 'Content Type should have at least one attribute');
});

test('Content Type config check attribute requires name', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{}],
  };
  let check = types.raw.check(type);
  t.is(check, 'Attribute must have a name', 'Content Type attributes require a name');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: '',
  }];
  check = types.raw.check(type);
  t.is(check, 'Attribute must have a name', 'Content Type attributes require a name');
});

test('Content Type config attribute name/string', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: ['foo'],
    }],
  };
  let check = types.raw.check(type);
  t.is(check, 'Attribute name must be a string', 'Content Type attributes require a name');

  type.attributes = [{
    name: [],
  }, {
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
  }];
  check = types.raw.check(type);
  t.is(check, 'Attribute name must be a string', 'Content Type attributes require a name');
});

test('Content Type config check attribute requires id', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: 'foo',
      id: '',
    }, {
      name: 'bar',
    }],
  };
  let check = types.raw.check(type);
  t.is(check, 'Attribute must have an id', 'Content Type attributes require a name');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
  }];
  check = types.raw.check(type);
  t.is(check, 'Attribute must have an id', 'Content Type attributes require a name');
});

test('Content Type config check attribute id is string', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: 'foo',
      id: [],
    }, {
      name: 'bar',
    }],
  };
  let check = types.raw.check(type);
  t.is(check, 'Attribute id must be a string', 'Attribute id must be a string');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
    id: {},
  }];
  check = types.raw.check(type);
  t.is(check, 'Attribute id must be a string', 'Attribute id must be a string');
});

test('Content Type config check attribute requires type', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: 'foo',
      id: 'foo',
      type: '',
    }, {
      name: 'bar',
    }],
  };
  let check = types.raw.check(type);
  t.is(check, 'Attribute must have a type', 'Content Type attributes require a type');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
    id: 'bar',
  }];
  check = types.raw.check(type);
  t.is(check, 'Attribute must have a type', 'Content Type attributes require a type');
});

test('Content Type config check attribute type is string', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: 'foo',
      id: 'foo',
      type: [],
    }, {
      name: 'bar',
      id: 'bar',
    }],
  };
  let check = types.raw.check(type);
  t.is(check, 'Attribute type must be a string', 'Attribute type must be a string');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
    id: 'bar',
    type: {},
  }];
  check = types.raw.check(type);
  t.is(check, 'Attribute type must be a string', 'Attribute type must be a string');
});

test('configuration check - winner', t => {
  const type = {
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

  const result = types.raw.check(type);
  t.true(result, 'Should be happy with a proper content type config');
});
