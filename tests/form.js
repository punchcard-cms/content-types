import test from 'ava';
import types from '../lib/content-types';
import form from '../lib/form';
import util from 'util';
import fs from 'fs';

test('Form Generation', t => {
  return types.only('foo').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('validation'), 'Validation JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.validation, 'string', 'Validation is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, Again', t => {
  return types.only('foo').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('validation'), 'Validation JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.validation, 'string', 'Validation is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, Again Again', t => {
  return types.only('bar').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('validation'), 'Validation JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.validation, 'string', 'Validation is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});
