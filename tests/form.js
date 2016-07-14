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
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, Again', t => {
  return types.only('foo').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, Again Again', t => {
  return types.only('bar').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');
  });
});

test('Form Generation, with required attributes and inputs', t => {
  return types.only('baz').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
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
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
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
    t.true(rendered.hasOwnProperty('scripts'), 'Form JS generated');
    t.true(rendered.hasOwnProperty('html'), 'HTML generated');

    t.is(typeof rendered.scripts, 'string', 'Scripts is a string');
    t.is(typeof rendered.html, 'string', 'HTML is a string');

    t.true(includes(rendered.html, errorMsg, 'error adds error message'));
    t.true(includes(rendered.html, 'name="email-field--email" aria-invalid="true"', 'error adds aria-invalid'));
  });
});

test('Form Generation, with ux scripts', t => {
  return types.only('baz').then(result => {
    return form(result);
  }).then(rendered => {
    t.true(includes(rendered.scripts, 'function selectsRelatedScript(', 'includes ux scripts'));
  });
});

test('Form Generation, overrides options in select', t => {
  return types.only('baz').then(result => {
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
  let errorMsg;
  const input = {
      id: 'bar',
      desciption: 'Bar Baz Foo',
      name: 'Content Type Bar',
      attributes: [
        {
          description: 'I am the Bar Content Type Config text field description',
          html: '<label for="{{text.id}}">{{text.label}}</label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />',
          id: 'something-new',
          inputs: {
            text: {
              id: '5ba58361-87b7-4e79-8ea0-e54635ad23bb',
              label: 'SOme New THING',
              name: 'something-new--text',
              placeholder: 'Text Goes Here',
              settings: {
                empty: true
              },
              type: 'text',
              validation: {
                function: 'textValidation',
                on: 'blur'
              },
              value: 'foo'
            }
          },
          name: 'SOme New THING',
          type: 'text',
          validation: 'validation'
        },
        {
          description: 'I am the Bar Content Type Config quote',
          html: '<label for="{{quote.id}}">{{quote.label}}</label><input type="{{quote.type}}" id="{{quote.id}}" name="{{quote.name}}" value="{{quote.value}}" placeholder="{{quote.placeholder}}" /><label for="{{author.id}}">{{author.label}}</label><input type="{{author.type}}" id="{{author.id}}" name="{{author.name}}" value="{{author.value}}" placeholder="{{author.placeholder}}" /><label for="{{source.id}}">{{source.label}}</label><input type="{{source.type}}" id="{{source.id}}" name="{{source.name}}" value="{{source.value}}" placeholder="{{source.placeholder}}" />',
          id: 'my-quote',
          repeatable: true,
          inputs: [
            {
              author: {
                id: '77215068-6739-45cb-9933-d72e1d19c9aa--0',
                label: 'Author:',
                name: 'my-quote--author--0',
                placeholder: 'Author Name',
                settings: {
                  empty: false
                },
                type: 'text',
                validation: {
                  function: 'quoteValidation',
                  on: 'blur'
                },
                value: 'bar'
              },
              quote: {
                id: 'c4087332-edda-432d-8464-cc9679742e4e--0',
                label: 'Citation:',
                name: 'my-quote--quote--0',
                placeholder: 'Source Material',
                settings: {
                  empty: false
                },
                type: 'text',
                validation: {
                  function: 'quoteValidation',
                  on: 'blur'
                },
                value: 'foo'
              },
              source: {
                id: 'c4087332-edda-432d-8464-cc9679742e4e--0',
                label: 'Citation:',
                name: 'my-quote--source--0',
                placeholder: 'Source Material',
                settings: {
                  empty: true
                },
                type: 'text',
                validation: {
                  function: 'sourceValidation',
                  on: 'blur'
                },
                value: 'baz'
              }
            },
            {
              author: {
                id: '77215068-6739-45cb-9933-d72e1d19c9aa--1',
                label: 'Author:',
                name: 'my-quote--author--1',
                placeholder: 'Author Name',
                settings: {
                  empty: false
                },
                type: 'text',
                validation: {
                  function: 'quoteValidation',
                  on: 'blur'
                },
                value: 'bar1'
              },
              quote: {
                id: 'c4087332-edda-432d-8464-cc9679742e4e--1',
                label: 'Citation:',
                name: 'my-quote--quote--1',
                placeholder: 'Source Material',
                settings: {
                  empty: false
                },
                type: 'text',
                validation: {
                  function: 'quoteValidation',
                  on: 'blur'
                },
                value: 'foo1'
              },
              source: {
                id: 'c4087332-edda-432d-8464-cc9679742e4e--1',
                label: 'Citation:',
                name: 'my-quote--source--1',
                placeholder: 'Source Material',
                settings: {
                  empty: true
                },
                type: 'text',
                validation: {
                  function: 'sourceValidation',
                  on: 'blur'
                },
                value: 'baz1'
              }
            },
            {
              author: {
                id: '77215068-6739-45cb-9933-d72e1d19c9aa--2',
                label: 'Author:',
                name: 'my-quote--author--2',
                placeholder: 'Author Name',
                settings: {
                  empty: false
                },
                type: 'text',
                validation: {
                  function: 'quoteValidation',
                  on: 'blur'
                },
                value: 'bar2'
              },
              quote: {
                id: 'c4087332-edda-432d-8464-cc9679742e4e--2',
                label: 'Citation:',
                name: 'my-quote--quote--2',
                placeholder: 'Source Material',
                settings: {
                  empty: false
                },
                type: 'text',
                validation: {
                  function: 'quoteValidation',
                  on: 'blur'
                },
                value: 'foo2'
              },
              source: {
                id: 'c4087332-edda-432d-8464-cc9679742e4e--2',
                label: 'Citation:',
                name: 'my-quote--source--2',
                placeholder: 'Source Material',
                settings: {
                  empty: true
                },
                type: 'text',
                validation: {
                  function: 'sourceValidation',
                  on: 'blur'
                },
                value: 'baz2'
              }
            }],
          name: 'SOme New THING',
          type: 'text',
          validation: 'validation'
        },
      ]
    };
  return form(input).then(rendered => {
    // fs.writeFileSync('fixtures/output.js', rendered.html);
    t.true(includes(rendered.html, '<label for="c4087332-edda-432d-8464-cc9679742e4e--0">Citation:</label>'), 'Indexing for label of first instance');
    t.true(includes(rendered.html, '<input type="text" id="c4087332-edda-432d-8464-cc9679742e4e--0" name="my-quote--quote--0" value="foo" placeholder="Source Material" />'), 'Indexing for label of second instance');
    t.true(includes(rendered.html, '<label for="c4087332-edda-432d-8464-cc9679742e4e--1">Citation:</label>'), 'Indexing for label of second instance');
    t.true(includes(rendered.html, '<input type="text" id="c4087332-edda-432d-8464-cc9679742e4e--1" name="my-quote--quote--1" value="foo1" placeholder="Source Material" />'), 'Indexing for input text of second instance');
  });
});

