import assert from 'node:assert/strict';
import test from 'node:test';

import ApiDocsPage from '../docs-src/api.11ty.cjs';

const customElements = {
  modules: [
    {
      declarations: [
        {
          customElement: true,
          tagName: 'commerce-hub-connect',
          description: 'CommerceHub Connect widget.',
          attributes: [
            {
              name: 'base-url',
              description: 'CommerceHub API base URL.',
              type: {
                text: 'CommerceHubBaseURLInput | undefined',
              },
            },
          ],
          members: [
            {
              kind: 'field',
              name: 'baseURL',
              attribute: 'base-url',
              description: 'CommerceHub API base URL.',
              type: {
                text: 'CommerceHubBaseURLInput | undefined',
              },
            },
          ],
          events: [
            {
              name: 'name',
            },
            {
              name: 'ON_SELECT_EVENT',
            },
          ],
        },
      ],
    },
  ],
};

const runtimeOpenapi = {
  components: {
    schemas: {
      InteractionResponse: {
        type: 'object',
        required: ['interactionId'],
        properties: {
          interactionId: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['OTP_VALIDATION_PENDING', 'COMPLETE'],
          },
          selectedSource: {
            oneOf: [
              {
                $ref: '#/components/schemas/BankAccount',
              },
            ],
          },
        },
      },
      AbstractSource: {
        type: 'object',
        discriminator: {
          propertyName: 'tenderType',
        },
        properties: {
          id: {
            type: 'string',
          },
          tenderType: {
            type: 'string',
            enum: ['BANK_ACCOUNT'],
          },
        },
      },
      BankAccount: {
        allOf: [
          {
            $ref: '#/components/schemas/AbstractSource',
          },
          {
            type: 'object',
            properties: {
              bankAccount: {
                $ref: '#/components/schemas/BankAccountDetail',
              },
            },
          },
        ],
      },
      BankAccountDetail: {
        type: 'object',
        properties: {
          accountNumber: {
            type: 'string',
          },
        },
      },
    },
  },
};

test('API page renders custom element APIs and runtime schemas as reference lists', () => {
  const html = new ApiDocsPage().render({
    api: {
      '11tydata': {
        customElements,
        runtimeOpenapi,
      },
    },
  });

  assert.doesNotMatch(html, /<table>/);
  assert.match(html, /<section class="api-section">/);
  assert.match(html, /<code class="api-item__name">baseURL<\/code>/);
  assert.match(html, /<dt class="api-meta__label">Attribute<\/dt>/);
  assert.match(html, /<code>base-url<\/code>/);
  assert.doesNotMatch(html, /<h3>Attributes<\/h3>/);
  assert.doesNotMatch(html, /<code class="api-item__name">name<\/code>/);
  assert.match(html, /<code class="api-item__name">onSelect<\/code>/);
  assert.match(html, /<h2>Runtime Schemas<\/h2>/);
  assert.match(
    html,
    /<details class="api-schema" id="schema-InteractionResponse">/
  );
  assert.match(
    html,
    /<span class="api-schema__name">InteractionResponse<\/span>/
  );
  assert.match(html, /<code class="api-item__name">interactionId<\/code>/);
  assert.match(html, /<dt class="api-meta__label">Required<\/dt>/);
  assert.match(html, /<code>yes<\/code>/);
  assert.match(html, /OTP_VALIDATION_PENDING, COMPLETE/);
  assert.match(html, /one of <a href="#schema-BankAccount">BankAccount<\/a>/);
  assert.match(
    html,
    /all of <a href="#schema-AbstractSource">AbstractSource<\/a>/
  );
  assert.match(html, /<dt class="api-meta__label">Discriminator<\/dt>/);
  assert.match(html, /<code>tenderType<\/code>/);
});
