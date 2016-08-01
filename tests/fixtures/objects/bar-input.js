'use strict';

const barInput = {
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
      inputs: {
        author: {
          id: '77215068-6739-45cb-9933-d72e1d19c9aa',
          label: 'Author:',
          name: 'my-quote--author',
          placeholder: 'Author Name',
          settings: {
            empty: false,
          },
          type: 'text',
          validation: {
            function: 'quoteValidation',
            on: 'blur',
          },
        },
        quote: {
          id: 'c4087332-edda-432d-8464-cc9679742e4e',
          label: 'Citation:',
          name: 'my-quote--quote',
          placeholder: 'Source Material',
          settings: {
            empty: false,
          },
          type: 'text',
          validation: {
            function: 'quoteValidation',
            on: 'blur',
          },
        },
        source: {
          id: 'c4087332-edda-432d-8464-cc9679742e4e',
          label: 'Citation:',
          name: 'my-quote--source',
          placeholder: 'Source Material',
          settings: {
            empty: true,
          },
          type: 'text',
          validation: {
            function: 'sourceValidation',
            on: 'blur',
          },
        },
      },
      name: 'SOme New THING',
      type: 'quote',
      validation: 'validation',
    },
  ],
};

module.exports = barInput;
