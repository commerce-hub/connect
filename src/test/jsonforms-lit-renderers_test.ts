import {assert} from '@open-wc/testing';

import {enumOptionLabel} from '../internal/jsonforms-lit/renderers.js';

suite('JSON Forms Lit renderers', () => {
  test('uses configured enum labels while retaining code fallback', () => {
    const schema = {
      enum: ['CA', 'NY', 'TX'],
      'x-enumLabels': {CA: 'California', NY: 'New York'},
    };

    assert.equal(enumOptionLabel(schema, 'CA'), 'California');
    assert.equal(enumOptionLabel(schema, 'NY'), 'New York');
    assert.equal(enumOptionLabel(schema, 'TX'), 'TX');
  });
});
