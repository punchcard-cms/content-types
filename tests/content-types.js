import test from 'ava';
import config from 'config';
import types from '../lib/content-types';
import util from 'util';
import fs from 'fs';

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
