import test from 'ava';
import types from '../lib/content-types';
import form from '../lib/form';
import util from 'util';
import fs from 'fs';
import includes from 'lodash/includes';

test('All Form Goodies', t => {
  t.is(typeof form, 'function', 'Form exports a function');

  t.is(typeof form.validate, 'function', 'Submodule `validate` exists and is a function');
});

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

test('Form Generation, with required attributes and inputs', t => {
  return types.only('baz').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('validation'), 'Validation JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.validation, 'string', 'Validation is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, 'class="required--save">Input required save', 'label gets save required classes'));
    t.true(includes(rendered.html, 'name="input-required-save--text" aria-required="true" required', 'input gets required--save'));
  });
});

test('Form Generation, required knows publish vs save', t => {
  return types.only('baz').then(result => {
    return form(result);
  }).then(rendered => {

    t.true(includes(rendered.html, '<div id="plugin-required-save" class="form--field required--save">', 'determines save for plugin'));
    t.true(includes(rendered.html, '<div id="plugin-required-publish" class="form--field required--publish">', 'determines publish for plugin'));
  });
});
