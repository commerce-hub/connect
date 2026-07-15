import {assert} from '@open-wc/testing';

import {LitJsonFormsStore} from '../internal/jsonforms-lit/index.js';

suite('LitJsonFormsStore', () => {
  test('preserves an explicit UI schema across data and schema updates', () => {
    const explicitUiSchema = {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/address/properties/city',
        },
      ],
    } as const;
    const store = new LitJsonFormsStore({
      schema: {
        type: 'object',
        properties: {
          address: {
            type: 'object',
            properties: {city: {type: 'string'}},
          },
        },
      },
      uischema: explicitUiSchema,
    });

    store.setData({address: {city: 'Toronto'}});
    store.setSchema({
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: {city: {type: 'string', minLength: 1}},
        },
      },
    });

    assert.strictEqual(
      store.getState().jsonforms.core?.uischema,
      explicitUiSchema
    );
  });
});
