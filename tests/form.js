import test from 'ava';
import includes from 'lodash/includes';

import types from '../lib/content-types';
import form from '../lib/form';

import config from './fixtures/config/default';
import barInput from './fixtures/objects/bar-expected.js';

test('All Form Goodies', t => {
  t.is(typeof form, 'function', 'Form exports a function');

  t.is(typeof form.validate, 'function', 'Submodule `validate` exists and is a function');
});

test('Form Generation', t => {
  return types.only('foo', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');

    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, Again', t => {
  return types.only('foo', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, Again Again', t => {
  return types.only('bar', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, with required attributes and inputs', t => {
  return types.only('baz', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, 'name="input-required-save--text" aria-required="true" required', 'input gets required--save'));
    t.true(includes(rendered.html, '<mark class="required--save">required to save</mark>', 'mark gets added after label text'));
  });
});

test('Form Generation, with identifier automatically required', t => {
  return types.only('foo', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, 'name="new-text-thing--text" aria-required="true" required', 'input gets required--save'));
    t.true(includes(rendered.html, '<mark class="required--save">required to save</mark>', 'mark gets added after label text'));
  });
});

test('Form Generation, with required, with classes on a label', t => {
  return types.only('baz', {}, '', config).then(rslt => {
    const result = rslt;
    result.attributes[0].html = '<label for="{{text.id}}" class="I-am-a-test this-must__still_be123-here">{{text.label}} <mark class="required--{{text.required}}">required to {{text.required}}</mark></label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />';
    result.attributes[2].html = '<label class="I-am-a-test this-must__still_be123-here" for="{{text.id}}">{{text.label}} <mark class="required--{{text.required}}">required to {{text.required}}</mark></label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />';

    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, '<mark class="required--save">required to save</mark>', 'mark gets added after label text'));
  });
});

test('Form Generation, with required attributes and inputs that have wrong levels', t => {
  return types.only('baz', {}, '', config).then(rslt => {
    const result = rslt;
    result.attributes[5].html = '<label for="{{text.id}}" class="I-am-a-test-of-bad-level">{{text.label}} <mark class="required--{{text.required}}">required to {{text.required}}</mark></label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />';

    return form(result);
  }).then(rendered => {
    t.true(includes(rendered.html, 'class="I-am-a-test-of-bad-level">Input required bad level', 'bad level adds zero classes'));
    t.true(includes(rendered.html, 'name="plugin-required-bad-level--text"', 'bad level adds zero attributes to input'));
  });
});

test('Form Generation, required knows publish vs save', t => {
  return types.only('baz', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(includes(rendered.html, '<mark class="required--save">required to save</mark>', 'determines save for plugin'));
    t.true(includes(rendered.html, '<mark class="required--publish">required to publish</mark>', 'determines publish for plugin'));
  });
});

test('Form Generation, with errors', t => {
  let errorMsg;

  return types.only('foo', {}, '', config).then(result => {
    const errors = {
      [result.attributes[1].inputs.email.name]: 'I am a test error',
    };
    errorMsg = `<p class="form--alert" role="alert" for="${result.attributes[1].inputs.email.id}">I am a test error</p>`;

    return form(result, errors);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, errorMsg, 'error adds error message'));
    t.true(includes(rendered.html, 'name="email-field--email" aria-invalid="true"', 'error adds aria-invalid'));
  });
});

test('Form Generation, with ux scripts', t => {
  return types.only('baz', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(includes(rendered.scripts, 'function selectsRelatedScript(', 'includes ux scripts'));
  });
});

test('Form Generation, overrides options in select', t => {
  return types.only('baz', {}, '', config).then(result => {
    return form(result);
  }).then(rendered => {
    t.true(includes(rendered.html, '<option value="option1" >Option 1</option>', 'determines existence of option1'));
    t.true(includes(rendered.html, '<option value="option2" >Option 2</option>', 'determines existence of option2'));
    t.false(includes(rendered.html, '<option value="mike" >Michaelangelo</option>', 'determines non-existence of default option 1'));
    t.false(includes(rendered.html, '<option value="leo" >Leonardo</option>', 'determines non-existence of default option 2'));
    t.false(includes(rendered.html, '<option value="ralph" >Raphael</option>', 'determines non-existence of default option 3'));
    t.false(includes(rendered.html, '<option value="don" >Donatello</option>', 'determines non-existence of default option 4'));
  });
});

test('Form Generation, with repeatables', t => {
  const input = barInput;

  return form(input).then(rendered => {
    // fs.writeFileSync('fixtures/output.js', rendered.html);
    t.true(includes(rendered.html, '<label for="c4087332-edda-432d-8464-cc9679742e4e--0">Citation:</label>'), 'Indexing for label of first instance');
    t.true(includes(rendered.html, '<input type="text" id="c4087332-edda-432d-8464-cc9679742e4e--0" name="my-quote--quote--0" value="foo" placeholder="Source Material" />'), 'Indexing for label of second instance');
    t.true(includes(rendered.html, '<label for="c4087332-edda-432d-8464-cc9679742e4e--1">Citation:</label>'), 'Indexing for label of second instance');
    t.true(includes(rendered.html, '<input type="text" id="c4087332-edda-432d-8464-cc9679742e4e--1" name="my-quote--quote--1" value="foo1" placeholder="Source Material" />'), 'Indexing for input text of second instance');
  });
});
