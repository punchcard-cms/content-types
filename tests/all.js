import test from 'ava';
import types from '../';

test('Main Export', t => {
  t.is(typeof types, 'function', 'Content Types exports a function');

  t.is(typeof types.raw, 'function', 'Submodule `raw` exists and is a function');
  t.is(typeof types.only, 'function', 'Submodule `only` exists and is a function');
});

test('Form Export', t => {
  t.is(typeof types.form, 'function', 'Submodule `form` exists and is a function');
  t.is(typeof types.form.validate, 'function', 'Submodule `form.validate` exists and is a function');
});
