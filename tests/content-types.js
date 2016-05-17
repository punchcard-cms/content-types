import test from 'ava';
import config from 'config';
import types from '../lib/content-types';
import util from 'util';
import fs from 'fs';

const fooContentObj = {
  'name': 'FooRific',
  'description': 'A very foo content model.',
  'attributes': [
    {
      'type': 'email',
      'id': 'email',
      'name': 'Email',
      'description': 'Your email is your username',
    },
  ],
};

test('Content Types', t => {
  return types.only('content-type-bar', {
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
      t.is(result[0].id, 'content-type-bar', 'Get first content type id');
      t.is(result[1].name, 'Content Type FOO', 'Get second content type name');
      t.is(result[1].description, 'Foo Bar Baz', 'Get second content type desc');
      t.is(result[1].id, 'content-type-foo', 'Get second content type id');
    });
});

test('merged with correct param', t => {
  fooContentObj.id = 'foo-rific';
  return types(fooContentObj)
    .then(result => {
      t.is(result[0].name, 'FooRific', 'Get first content type name');
      t.is(result[0].description, 'A very foo content model.', 'Get first content type desc');
      t.is(result[0].id, 'foo-rific', 'Get first content type id');
    });
})
