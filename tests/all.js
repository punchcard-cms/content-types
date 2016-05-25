import test from 'ava';
import types from '../';

test('Everything Ever', t => {
  t.is(typeof types, 'function', 'Content Types exports a function');

  t.is(typeof types.raw, 'function', 'Submodule `raw` exists and is a function');
  t.is(typeof types.one, 'function', 'Submodule `one` exists and is a function');
  t.is(typeof types.only, 'function', 'Submodule `only` exists and is a function');
  t.is(typeof types.form, 'function', 'Submodule `forms` exists and is a function');
  t.is(typeof types.pluginTests, 'function', 'Submodule `pluginTests` exists and is a function');
});
