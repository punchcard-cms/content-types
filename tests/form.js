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

test('Form Generation, with required, with classes on a label', t => {
  return types.only('baz').then(result => {
    result.attributes[0].html = '<label for="{{text.id}}" class="I-am-a-test this-must__still_be123-here">{{text.label}}</label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />';
    result.attributes[2].html = '<label class="I-am-a-test this-must__still_be123-here" for="{{text.id}}">{{text.label}}</label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />';
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('validation'), 'Validation JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.validation, 'string', 'Validation is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, 'class="I-am-a-test this-must__still_be123-here required--save">Plugin required save', 'label gets save required classes if class after for'));
    t.true(includes(rendered.html, 'class="I-am-a-test this-must__still_be123-here required--publish" for="', 'label gets save required classes if class before for'));
  });
});

test('Form Generation, with required attributes and inputs that have wrong levels', t => {
  return types.only('baz').then(result => {
    result.attributes[5].html = '<label for="{{text.id}}" class="I-am-a-test-of-bad-level">{{text.label}}</label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />';
    return form(result);
  }).then(rendered => {

    t.true(includes(rendered.html, 'class="I-am-a-test-of-bad-level">Input required bad level', 'bad level adds zero classes'));
    t.true(includes(rendered.html, 'name="plugin-required-bad-level--text"', 'bad level adds zero attributes to input'));
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

test('Form Generation, with errors', t => {
  let errorMsg;
  return types.only('foo').then(result => {
    const errors = {
      [result.attributes[1].inputs.email.name]: 'I am a test error',
    };
    errorMsg = `<p class="form--alert" role="alert" for="${result.attributes[1].inputs.email.id}">I am a test error</p>`;

    return form(result, errors);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('validation'), 'Validation JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.validation, 'string', 'Validation is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, errorMsg, 'error adds error message'));
    t.true(includes(rendered.html, 'name="email-field--email" aria-invalid="true"', 'error adds aria-invalid'));
  });
});
