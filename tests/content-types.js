import test from 'ava';
import config from 'config';
import types from '../lib/content-types';
import util from 'util';
import fs from 'fs';
import only from '../lib/content-types/only.js';

test('Content Types', t => {
  return only({
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
            }
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
        inputs: {
          author: {
            id: '77215068-6739-45cb-9933-d72e1d19c9aa',
            label: 'Author:',
            name: 'my-quote--author',
            placeholder: 'Author Name',
            settings: {
              empty: false
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur'
            }
          },
          quote: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e',
            label: 'Citation:',
            name: 'my-quote--quote',
            placeholder: 'Source Material',
            settings: {
              empty: false
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur'
            }
          },
          source: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e',
            label: 'Citation:',
            name: 'my-quote--source',
            placeholder: 'Source Material',
            settings: {
              empty: true
            },
            type: 'text',
            validation: {
              function: 'sourceValidation',
              on: 'blur'
            }
          }
        },
        name: 'SOme New THING',
        type: 'text',
        validation: 'validation'
      },
    ]
  }, {
    'something-new': {
      text: {value: 'foo'}
    },
    'my-quote': [
      {
        author: {value: 'bar'},
        quote: {value: 'foo'},
        source: {value: 'baz'}
      },
      {
        author: {value: 'bar1'},
        quote: {value: 'foo1'},
        source: {value: 'baz1'}
      },
      {
        author: {value: 'bar2'},
        quote: {value: 'foo2'},
        source: {value: 'baz2'}
      }
    ]
  }).then(result => {
    const expected = {
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
    t.deepEqual(result, expected, 'Only method works!');
    t.pass();
  })
});


test('merged', t => {
  return types()
    .then(result => {
      t.is(result[0].name, 'Content Type BAR', 'Get first content type name');
      t.is(result[0].description, 'Bar Baz Foo', 'Get first content type desc');
      t.is(result[0].id, 'bar', 'Get first content type id');
      t.is(result[1].name, 'Content Type Baz', 'Get second content type name');
      t.is(result[1].description, 'Bar Baz Foo', 'Get second content type desc');
      t.is(result[1].id, 'baz', 'Get second content type id');
      t.is(result[2].name, 'Content Type FOO', 'Get third content type name');
      t.is(result[2].description, 'Foo Bar Baz', 'Get third content type desc');
      t.is(result[2].id, 'foo', 'Get third content type id');
    });
});

test('reject when something other than array is passed in', t => {
  const testCT = {
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'input-plugin-text',
        id: 'text',
        name: 'Text',
      },
    ],
  };

  return types(testCT).then(result => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Content types must be an array', 'Non-Array Rejected');
  });
});

test('reject when plugin not found', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'input-plugin-text',
        id: 'text',
        name: 'Text',
      },
    ],
  }];

  return types(testCT).then(result => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'input-plugin-text\' not found', 'Missing Plugin');
  });
});

test('reject when name not found - no id', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
      },
    ],
  }];

  return types(testCT).then(result => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'text\' in content type \'Foo\' needs a name', 'Missing Name');
  });
});

test('reject when name not found - id', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        id: 'My Text',
      },
    ],
  }];

  return types(testCT).then(result => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'My Text\' in content type \'Foo\' needs a name', 'Missing Name');
  });
});

test('reject when id not found', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        name: 'My Text',
      },
    ],
  }];

  return types(testCT).then(result => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input \'My Text\' in content type \'Foo\' needs an ID', 'Missing ID');
  });
});

test('reject when id is not kebab case', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        name: 'My Text',
        id: 'myText',
      },
    ],
  }];

  return types(testCT).then(result => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input ID \'myText\' needs to be written in kebab case (e.g. \'my-text\')', 'Not Kebab ID');
  });
});

test('reject when id is duplicated', t => {
  const testCT = [{
    name: 'Foo',
    id: 'foo',
    attributes: [
      {
        type: 'text',
        name: 'My Text',
        id: 'my-text',
      },
      {
        type: 'email',
        name: 'My Email',
        id: 'my-text',
      },
    ],
  }];

  return types(testCT).then(result => {
    t.fail('Merged should fail');
  }).catch(e => {
    t.is(e.message, 'Input ID \'my-text\' in content type \'Foo\' cannot be duplicated (in \'My Email\')', 'No Duplicate IDs');
  });
});


test('merged with correct param', t => {
  const testCT = {
    name: 'FooRific',
    description: 'A very foo content model.',
    id: 'foo-rific',
    attributes: [
      {
        type: 'text',
        id: 'username',
        name: 'Username',
        description: 'Please enter a username',
      },
      {
        type: 'text',
        id: 'full-name',
        name: 'Full Name',
        description: 'Please enter your full name',
        inputs: {
          text: {
            label: 'Foo Bar Baz',
          },
        },
      },
      {
        type: 'selects-related',
        id: 'related-selects',
        name: 'Related Select Fields',
        description: 'Please choose wisely',
        inputs: {
          select1: {
            label: 'I am the first',
          },
          select2: {
            label: 'I am the second',
          },
        },
      },
    ],
  };

  return types([testCT])
    .then(result => {
      let input;
      const merged = result[0];

      t.is(result.length, 1, 'There is one result');

      t.is(merged.name, 'FooRific', 'Content type name does not change');
      t.is(merged.description, 'A very foo content model.', 'Content type description does not change');
      t.is(merged.id, 'foo-rific', 'Content type ID does not change');
      t.true(merged.hasOwnProperty('attributes'), 'Content type has attributes');
      t.is(merged.attributes.length, 3, 'Content type has three attributes');

      merged.attributes.forEach((attr, i) => {
        let base = testCT.attributes[i];

        t.is(attr.name, base.name, 'Attribute name does not change');
        t.is(attr.description, base.description, 'Attribute description does not change');
        t.is(attr.id, base.id, 'Attribute ID does not change');
        t.is(attr.type, base.type, 'Attribute type does not change');

        t.true(attr.hasOwnProperty('validation'), 'Attribute has validation');
        t.true(attr.hasOwnProperty('html'), 'Attribute has HTML');
        t.true(attr.hasOwnProperty('inputs'), 'Attribute has inputs');

        if (Object.keys(attr.inputs).length === 1) {
          input = Object.keys(attr.inputs)[0];

          if (base.hasOwnProperty('inputs')) {
            if (base.inputs.hasOwnProperty(input)) {
              if (base.inputs[input].hasOwnProperty('label')) {
                t.is(attr.inputs[input].label, base.inputs[input].label, 'Input label is used if present in base if one input');
              }
            }
          }
          else {
            t.is(attr.inputs[input].label, base.name, 'Input label is set to name if one input');
          }
        }

        if (attr === merged.attributes[2]) {
          input = Object.keys(attr.inputs);
          t.true(attr.inputs[input[0]].hasOwnProperty('script'), 'Attribute has scripts');
          t.true(attr.inputs[input[1]].hasOwnProperty('script'), 'Attribute has scripts');
        }

      });
    });
})
