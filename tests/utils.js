import test from 'ava';
import utils from '../lib/utils.js';
import _ from 'lodash';
import path from 'path';
import childProcess from 'child_process';

const exec = childProcess.execSync;

const root = exec('npm root').toString().trim();
const config = {
  content: {
    plugins: {
      directory: '/path/to/local',
    },
  },
};

//////////////////////////////
// getPlugins
//////////////////////////////
test('Getplugins works with directory value as string', t => {
  const input = {};
  _.set(input, 'content.plugins.directory', path.join(process.cwd(), 'fixtures'));
  t.is(typeof utils.getPlugins(input), 'object');
});

test('Getplugins works with directory value as boolean', t => {
  const input = {};
  _.set(input, 'content.plugins.directory', true);
  t.is(typeof utils.getPlugins(input), 'object');
});

test('Getplugins works with directory value as undefined', t => {
  const input = {};
  t.is(typeof utils.getPlugins(input), 'object');
});

//////////////////////////////
// getPluginsDirs
//////////////////////////////
test('getPluginsDirs returns node_modules', t => {
  const result = utils.getPluginsDirs();

  t.true(Array.isArray(result), 'Should return an array');
  t.true(result.length === 1, 'Should have one directory');
  t.is(result[0], root, 'Should have node_modules');
});

test('getPluginsDirs returns string directories', t => {
  const globalConfig = _.cloneDeep(config);

  const result = utils.getPluginsDirs(globalConfig);

  t.true(Array.isArray(result), 'Should return an array');
  t.true(result.length === 2, 'Should have two directories');
  t.true(result.indexOf(root) > -1, 'Should have node_modules');
  t.true(result.indexOf('/path/to/local') > -1, 'Should have local');
});

test('getPluginsDirs returns array directories', t => {
  const globalConfig = _.cloneDeep(config);

  globalConfig.content.plugins.directory = ['/path/to/core/1', '/path/to/core/2', '/path/to/local/1', '/path/to/local/2'];

  const result = utils.getPluginsDirs(globalConfig);

  t.true(Array.isArray(result), 'Should return an array');
  t.true(result.length === 5, 'Should have three directories');
  t.true(result.indexOf(root) > -1, 'Should have node_modules');
  t.true(result.indexOf('/path/to/core/1') > -1, 'Should have core 1');
  t.true(result.indexOf('/path/to/core/2') > -1, 'Should have core 2');
  t.true(result.indexOf('/path/to/local/1') > -1, 'Should have local 1');
  t.true(result.indexOf('/path/to/local/2') > -1, 'Should have local 2');
});

test('getPluginsDirs returns no duplications', t => {
  const globalConfig = _.cloneDeep(config);

  globalConfig.content.plugins.directory = ['/path/to/plugin/1', '/path/to/plugin/1', '/path/to/plugin/2', root];

  const result = utils.getPluginsDirs(globalConfig);

  t.true(Array.isArray(result), 'Should return an array');
  t.true(result.length === 3, 'Should have three directories');
  t.true(result.indexOf(root) > -1, 'Should have node_modules');
  t.true(result.indexOf('/path/to/plugin/1') > -1, 'Should have plugin 1');
  t.true(result.indexOf('/path/to/plugin/2') > -1, 'Should have plugin 2');
});
