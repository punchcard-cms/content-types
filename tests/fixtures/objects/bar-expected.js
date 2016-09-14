'use strict';

const barExpected = {
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
            empty: true,
          },
          type: 'text',
          validation: {
            function: 'textValidation',
            on: 'blur',
          },
          value: 'foo',
        },
      },
      name: 'SOme New THING',
      type: 'text',
      validation: 'validation',
    },
    {
      description: 'I am the Bar Content Type Config quote',
      html: '<label for="{{quote.id}}">{{quote.label}}</label><input type="{{quote.type}}" id="{{quote.id}}" name="{{quote.name}}" value="{{quote.value}}" placeholder="{{quote.placeholder}}" /><label for="{{author.id}}">{{author.label}}</label><input type="{{author.type}}" id="{{author.id}}" name="{{author.name}}" value="{{author.value}}" placeholder="{{author.placeholder}}" /><label for="{{source.id}}">{{source.label}}</label><input type="{{source.type}}" id="{{source.id}}" name="{{source.name}}" value="{{source.value}}" placeholder="{{source.placeholder}}" />',
      id: 'my-quote',
      repeatable: {
        min: 1,
        max: 9007199254740991,
      },
      inputs: [
        {
          author: {
            id: '77215068-6739-45cb-9933-d72e1d19c9aa--0',
            label: 'Author:',
            name: 'my-quote--author--0',
            placeholder: 'Author Name',
            settings: {
              empty: false,
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur',
            },
            value: 'bar',
          },
          quote: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e--0',
            label: 'Citation:',
            name: 'my-quote--quote--0',
            placeholder: 'Source Material',
            settings: {
              empty: false,
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur',
            },
            value: 'foo',
          },
          source: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e--0',
            label: 'Citation:',
            name: 'my-quote--source--0',
            placeholder: 'Source Material',
            settings: {
              empty: true,
            },
            type: 'text',
            validation: {
              function: 'sourceValidation',
              on: 'blur',
            },
            value: 'baz',
          },
        },
        {
          author: {
            id: '77215068-6739-45cb-9933-d72e1d19c9aa--1',
            label: 'Author:',
            name: 'my-quote--author--1',
            placeholder: 'Author Name',
            settings: {
              empty: false,
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur',
            },
            value: 'bar1',
          },
          quote: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e--1',
            label: 'Citation:',
            name: 'my-quote--quote--1',
            placeholder: 'Source Material',
            settings: {
              empty: false,
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur',
            },
            value: 'foo1',
          },
          source: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e--1',
            label: 'Citation:',
            name: 'my-quote--source--1',
            placeholder: 'Source Material',
            settings: {
              empty: true,
            },
            type: 'text',
            validation: {
              function: 'sourceValidation',
              on: 'blur',
            },
            value: 'baz1',
          },
        },
        {
          author: {
            id: '77215068-6739-45cb-9933-d72e1d19c9aa--2',
            label: 'Author:',
            name: 'my-quote--author--2',
            placeholder: 'Author Name',
            settings: {
              empty: false,
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur',
            },
            value: 'bar2',
          },
          quote: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e--2',
            label: 'Citation:',
            name: 'my-quote--quote--2',
            placeholder: 'Source Material',
            settings: {
              empty: false,
            },
            type: 'text',
            validation: {
              function: 'quoteValidation',
              on: 'blur',
            },
            value: 'foo2',
          },
          source: {
            id: 'c4087332-edda-432d-8464-cc9679742e4e--2',
            label: 'Citation:',
            name: 'my-quote--source--2',
            placeholder: 'Source Material',
            settings: {
              empty: true,
            },
            type: 'text',
            validation: {
              function: 'sourceValidation',
              on: 'blur',
            },
            value: 'baz2',
          },
        }],
      name: 'SOme New THING',
      type: 'quote',
      validation: 'validation',
    },
    {
      description: 'I am the Bar Content Type Config text field repeatable',
      html: '<label for="{{text.id}}">{{text.label}}</label><input type="{{text.type}}" id="{{text.id}}" name="{{text.name}}" value="{{text.value}}" placeholder="{{text.placeholder}}" />',
      id: 'something-new',
      repeatable: {
        min: 1,
        max: 9007199254740991,
      },
      inputs: [
        {
          text: {
            id: '5ba58361-87b7-4e79-8ea0-e54635ad23bb--0',
            label: 'SOme New THING',
            name: 'something-new--text--0',
            placeholder: 'Text Goes Here',
            settings: {
              empty: true,
            },
            type: 'text',
            validation: {
              function: 'textValidation',
              on: 'blur',
            },
            value: 'foo',
          },
        },
      ],
      name: 'SOme New THING',
      type: 'text',
      validation: 'validation',
    },
  ],
};

module.exports = barExpected;
