import {assert} from '@open-wc/testing';

import {resolvePayByBankCustomerDetails} from '../internal/pay-by-bank-customer-details.js';

suite('Pay by Bank customer details', () => {
  test('maps complete data and uses phoneNumber without countryCode', () => {
    assert.deepEqual(
      resolvePayByBankCustomerDetails({
        firstName: ' John ',
        lastName: ' Doe ',
        email: ' john@example.com ',
        phoneDetails: {countryCode: '+1', phoneNumber: ' 2145550123 '},
      }),
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '2145550123',
      }
    );
  });

  test('forwards partial data and omits blanks', () => {
    assert.deepEqual(
      resolvePayByBankCustomerDetails({
        firstName: ' Jane ',
        lastName: ' ',
        email: '',
        phoneDetails: {countryCode: '+1', phoneNumber: ' '},
      }),
      {firstName: 'Jane'}
    );
  });

  test('returns no values when entity data is absent', () => {
    assert.deepEqual(resolvePayByBankCustomerDetails(undefined), {});
  });
});
