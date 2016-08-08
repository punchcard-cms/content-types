import test from 'ava';
import util from '../lib/util.js';
import _ from 'lodash';
import path from 'path';

test('Getplugins works with directory value as string', t => {
  const input = {};
  _.set(input, 'content.plugins.directory', path.join(process.cwd(), 'fixtures'));
  t.is(typeof util.getPlugins(input), 'object');
});

test('Getplugins works with directory value as boolean', t => {
  const input = {};
  _.set(input, 'content.plugins.directory', true);
  t.is(typeof util.getPlugins(input), 'object');
});

test('Getplugins works with directory value as undefined', t => {
  const input = {};
  t.is(typeof util.getPlugins(input), 'object');
});
