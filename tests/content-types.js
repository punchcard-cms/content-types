import test from 'ava';
import config from 'config';
import types from '../lib/content-types';
import util from 'util';
import fs from 'fs';

test('Content Types', t => {
  return types.only('bar', {
    'my-textarea': {
      textarea: {
        value: 'Hello World I am here'
      }
    }
  }).then(result => {
    // console.log(util.inspect(result, false, null));
    // fs.writeFileSync('fixtures/output.js', JSON.stringify(result, null, 2));
    t.pass();
  })
})

test('merged', t => {
  return types()
    .then(result => {
      t.is(result[0].name, 'Content Type BAR', 'Get first content type name');
      t.is(result[0].description, 'Bar Baz Foo', 'Get first content type desc');
      t.is(result[0].id, 'bar', 'Get first content type id');
      t.is(result[1].name, 'Content Type FOO', 'Get second content type name');
      t.is(result[1].description, 'Foo Bar Baz', 'Get second content type desc');
      t.is(result[1].id, 'foo', 'Get second content type id');
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

  return types(testCT).then(result => {
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

  return types(testCT).then(result => {
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

  return types(testCT).then(result => {
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

  return types(testCT).then(result => {
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

  return types(testCT).then(result => {
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

  return types(testCT).then(result => {
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

  return types(testCT).then(result => {
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
    ],
  };

  return types([testCT])
    .then(result => {
      // console.log(util.inspect(result, false, null));
      t.is(result[0].name, 'FooRific', 'Get first content type name');
      t.is(result[0].description, 'A very foo content model.', 'Get first content type desc');
      t.is(result[0].id, 'foo-rific', 'Get first content type id');
    });
})
