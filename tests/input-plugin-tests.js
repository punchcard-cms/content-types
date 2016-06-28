import test from 'ava';
import config from 'config';

import plugin from '../lib/input-plugin-tests';

// fixtures
import single from './fixtures/input-plugins/input-plugin-single';
import checkbox from './fixtures/input-plugins/input-plugin-checkbox';
import range from './fixtures/input-plugins/input-plugin-range';
import radio from './fixtures/input-plugins/input-plugin-radio';
import singleTextarea from './fixtures/input-plugins/input-plugin-single-textarea';
import singleSelect from './fixtures/input-plugins/input-plugin-single-select';
import singleSelectMultiple from './fixtures/input-plugins/input-plugin-single-select-multiple';
import multipleText from './fixtures/input-plugins/input-plugin-multiple-text';
import multipleSelect from './fixtures/input-plugins/input-plugin-multiple-select';
import multipleTextarea from './fixtures/input-plugins/input-plugin-multiple-textarea';
import multipleCheckbox from './fixtures/input-plugins/input-plugin-multiple-checkbox';
import multipleRadio from './fixtures/input-plugins/input-plugin-multiple-radio';
import multipleMixed from './fixtures/input-plugins/input-plugin-multiple-mixed';

const validation = function (input, settings) {
  return {
    input,
    settings
  }
};

test('Input Plugin Tests Requires Test and Plugin', t => {
  let validated = false;
  if (plugin(false, single) === 'you must include a test runner') {
    validated = true;
  }
  t.true(validated, 'A test runner must be parameter 1');

  validated = false;
  if (plugin(test, false) === 'you must include a plugin to test') {
    validated = true;
  }
  t.true(validated, 'The plugin must be parameter 2');

  validated = false;
  if (plugin(test, 'foo') === 'plugin must be an object') {
    validated = true;
  }
  t.true(validated, 'Plugin must be an object');
});

plugin(test, single);

plugin(test, checkbox);

plugin(test, range);

plugin(test, radio);

plugin(test, singleTextarea);

plugin(test, singleSelect);

plugin(test, singleSelectMultiple);

plugin(test, multipleText);

plugin(test, multipleSelect);

plugin(test, multipleTextarea);

plugin(test, multipleCheckbox);

plugin(test, multipleRadio);

plugin(test, multipleMixed);
