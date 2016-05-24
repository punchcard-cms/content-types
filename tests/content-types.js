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

// waiting on rejection story
// test('merged with bad param', t => {
//   return types(fooContentObj)
//     .catch(result => {
//       console.log(result);
//       t.is(result, '[Error: Content types must be an array]', 'Gotta send an array');
//     });
// })

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
