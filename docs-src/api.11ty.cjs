/**
 * This page generates its content from the custom-element.json file as read by
 * the _data/api.11tydata.js script.
 */
module.exports = class Docs {
  data() {
    return {
      layout: 'page.11ty.cjs',
      title: '<commerce-hub-connect> ⌲ API',
    };
  }

  render(data) {
    const apiData = data.api['11tydata'];
    const manifest = apiData.customElements;
    const runtimeOpenapi = apiData.runtimeOpenapi;
    const elements = manifest.modules
      .reduce(
        (els, module) =>
          els.concat(
            module.declarations?.filter((dec) => dec.customElement) ?? []
          ),
        []
      )
      .filter((element) => element.tagName === 'commerce-hub-connect');
    const html = `
     <h1>API</h1>
     ${elements
       .map(
         (element) => `
       <h2>&lt;${element.tagName}></h2>
       <div class="api-intro">
         ${renderDescription(element.description)}
       </div>
       ${renderElementApi(element)}
       `
       )
       .join('')}
     ${renderRuntimeSchemas(runtimeOpenapi)}
   `;

    return html.replace(/[ \t]+$/gm, '');
  }
};

const normalizeEvents = (events) => {
  const publicEventNames = {
    ON_SELECT_EVENT: 'onSelect',
    ON_ADD_PAYMENT_METHOD_EVENT: 'onAddPaymentMethod',
    ON_VERIFY_PAYMENT_METHOD_EVENT: 'onVerifyPaymentMethod',
    ON_DELETE_PAYMENT_METHOD_EVENT: 'onDeletePaymentMethod',
    ON_LIST_PAYMENT_METHODS_EVENT: 'onListPaymentMethods',
    ON_TRANSFER_EVENT: 'onTransfer',
  };
  const normalized =
    events?.flatMap((event) => {
      const name = publicEventNames[event.name];

      if (!name && event.name === 'name' && !event.description) {
        return [];
      }

      return {
        ...event,
        name: name || event.name,
        description: event.description || eventDescriptions[name],
      };
    }) ?? [];
  const byName = new Map();

  for (const event of normalized) {
    const existing = byName.get(event.name);

    if (!existing || (!existing.description && event.description)) {
      byName.set(event.name, event);
    }
  }

  return [...byName.values()];
};

const eventDescriptions = {
  onSelect:
    'Emitted with the selected PaymentSource after a verified payment source is attached or selected.',
  onAddPaymentMethod:
    'Emitted with the created or finalized PaymentSource after a payment method is successfully added.',
  onVerifyPaymentMethod:
    'Emitted with the verified or updated PaymentSource after a payment method is successfully verified.',
  onDeletePaymentMethod:
    'Emitted with the deleted payment source id after a payment method is successfully deleted.',
  onListPaymentMethods:
    'Emitted with PaymentSource[] after payment methods are successfully refreshed from the interaction.',
  onTransfer:
    'Emitted with the NativeAccountTransaction after a native account transfer is successfully initiated.',
};

const renderElementApi = (element) => {
  const members = element.members ?? [];
  const attributes = element.attributes ?? [];
  const slots = element.slots ?? [];
  const cssParts = element.cssParts ?? [];
  const cssProperties = element.cssProperties ?? [];
  const publicFields = members.filter(
    (member) => member.kind === 'field' && member.privacy !== 'private'
  );
  const memberAttributes = new Set(
    publicFields.map((member) => member.attribute).filter(Boolean)
  );
  const standaloneAttributes = attributes.filter(
    (attribute) => !memberAttributes.has(attribute.name)
  );
  const methods = members.filter(
    (member) => member.kind === 'method' && member.privacy !== 'private'
  );

  return `
       ${renderApiSection('Properties', publicFields.map(fieldApiItem))}
       ${renderApiSection(
         'Attributes',
         standaloneAttributes.map(attributeApiItem)
       )}
       ${renderApiSection('Methods', methods.map(methodApiItem))}
       ${renderApiSection(
         'Events',
         normalizeEvents(element.events).map(eventApiItem)
       )}
       ${renderApiSection('Slots', slots.map(slotApiItem))}
       ${renderApiSection('CSS Shadow Parts', cssParts.map(namedApiItem))}
       ${renderApiSection(
         'CSS Custom Properties',
         cssProperties.map(namedApiItem)
       )}
  `;
};

const fieldApiItem = (field) => ({
  name: field.name,
  description: field.description,
  meta: [
    field.attribute && {
      label: 'Attribute',
      valueHtml: renderCode(field.attribute),
    },
    field.type?.text && {
      label: 'Type',
      valueHtml: renderCode(field.type.text),
    },
    field.default && {
      label: 'Default',
      valueHtml: renderCode(field.default),
    },
  ],
});

const attributeApiItem = (attribute) => ({
  name: attribute.name,
  description: attribute.description,
  meta: [
    attribute.type?.text && {
      label: 'Type',
      valueHtml: renderCode(attribute.type.text),
    },
    attribute.default && {
      label: 'Default',
      valueHtml: renderCode(attribute.default),
    },
  ],
});

const methodApiItem = (method) => ({
  name: method.name,
  description: method.description,
  meta: [
    method.return?.type?.text && {
      label: 'Returns',
      valueHtml: renderCode(method.return.type.text),
    },
  ],
  children:
    method.parameters?.length > 0
      ? renderApiSection(
          'Parameters',
          method.parameters.map((parameter) => ({
            name: parameter.name,
            description: parameter.description,
            meta: [
              parameter.type?.text && {
                label: 'Type',
                valueHtml: renderCode(parameter.type.text),
              },
            ],
          })),
          'api-section api-section--nested'
        )
      : '',
});

const eventApiItem = (event) => ({
  name: event.name,
  description: event.description,
});

const slotApiItem = (slot) => ({
  name: slot.name || '(default)',
  description: slot.description,
});

const namedApiItem = (item) => ({
  name: item.name,
  description: item.description,
});

const renderApiSection = (name, items, className = 'api-section') => {
  const visibleItems = items.filter(Boolean);

  if (visibleItems.length === 0) {
    return '';
  }

  return `
     <section class="${className}">
       <h3>${escapeHtml(name)}</h3>
       <div class="api-list">
         ${visibleItems.map(renderApiItem).join('')}
       </div>
     </section>
  `;
};

const renderApiItem = (item) => `
     <article class="api-item">
       <div class="api-item__header">
         <code class="api-item__name">${escapeHtml(item.name)}</code>
       </div>
       ${renderMeta(item.meta)}
       ${renderDescription(item.description, 'api-item__description')}
       ${item.children || ''}
     </article>
`;

const renderMeta = (meta = []) => {
  const visibleMeta = meta.filter(Boolean);

  if (visibleMeta.length === 0) {
    return '';
  }

  return `
       <dl class="api-meta">
         ${visibleMeta
           .map(
             (entry) => `
           <div class="api-meta__item">
             <dt class="api-meta__label">${escapeHtml(entry.label)}</dt>
             <dd class="api-meta__value">${entry.valueHtml}</dd>
           </div>
         `
           )
           .join('')}
       </dl>
  `;
};

const renderRuntimeSchemas = (openapi) => {
  const schemas = openapi?.components?.schemas ?? {};
  const entries = Object.entries(schemas);

  if (entries.length === 0) {
    return '';
  }

  return `
     <h2>Runtime Schemas</h2>
     <p>Generated from <code>swagger.json</code> <code>components.schemas</code>.</p>
     <section class="api-schemas">
       ${entries.map(([name, schema]) => renderSchema(name, schema)).join('')}
     </section>
  `;
};

const renderSchema = (name, schema) => {
  const properties = schemaProperties(schema);
  const composition = schemaComposition(schema);
  const discriminator = schema.discriminator?.propertyName;

  return `
     <details class="api-schema" id="schema-${escapeHtml(name)}">
       <summary class="api-schema__summary">
         <span class="api-schema__name">${escapeHtml(name)}</span>
         <span class="api-schema__meta">${schemaSummary(schema)} · ${
    properties.length
  } ${properties.length === 1 ? 'field' : 'fields'}</span>
       </summary>
       <div class="api-schema__body">
         <dl class="api-meta api-meta--stacked">
           ${
             composition ? renderMetaDefinition('Composition', composition) : ''
           }
           ${
             schema.type
               ? renderMetaDefinition('Type', renderCode(schema.type))
               : ''
           }
           ${
             discriminator
               ? renderMetaDefinition(
                   'Discriminator',
                   renderCode(discriminator)
                 )
               : ''
           }
         </dl>
         ${renderApiSection(
           'Properties',
           properties.map(schemaPropertyApiItem),
           'api-section api-section--nested'
         )}
       </div>
     </details>
  `;
};

const schemaProperties = (schema) => {
  const required = new Set(schema.required ?? []);
  const properties = [];
  const addProperties = (propertySchema) => {
    for (const [name, value] of Object.entries(
      propertySchema.properties ?? {}
    )) {
      properties.push({
        name,
        required: required.has(name) ? 'yes' : 'no',
        typeHtml: schemaType(value),
        details: schemaDetails(value),
      });
    }
  };

  addProperties(schema);

  for (const part of schema.allOf ?? []) {
    for (const name of part.required ?? []) {
      required.add(name);
    }
    addProperties(part);
  }

  return properties;
};

const schemaComposition = (schema) => {
  if (schema.allOf) {
    return `all of ${schema.allOf.map(schemaType).join(', ')}`;
  }

  if (schema.oneOf) {
    return `one of ${schema.oneOf.map(schemaType).join(', ')}`;
  }

  return '';
};

const schemaType = (schema) => {
  if (schema.$ref) {
    return schemaRef(schema.$ref);
  }

  if (schema.oneOf) {
    return `one of ${schema.oneOf.map(schemaType).join(', ')}`;
  }

  if (schema.allOf) {
    return `all of ${schema.allOf.map(schemaType).join(', ')}`;
  }

  if (schema.type === 'array') {
    const itemType = schema.items ? schemaType(schema.items) : 'unknown';
    return `array of ${itemType}`;
  }

  if (schema.type && schema.format) {
    return `${escapeHtml(schema.type)} (${escapeHtml(schema.format)})`;
  }

  if (schema.type) {
    return escapeHtml(schema.type);
  }

  if (schema.properties) {
    return 'object';
  }

  return '';
};

const schemaRef = (ref) => {
  const name = ref.split('/').pop();
  return `<a href="#schema-${escapeHtml(name)}">${escapeHtml(name)}</a>`;
};

const schemaDetails = (schema) => {
  const details = [];
  const enumValues = schema.enum ?? schema.items?.enum;

  if (enumValues) {
    details.push(
      enumValues.map((value) => escapeHtml(String(value))).join(', ')
    );
  }

  if (schema.uniqueItems) {
    details.push('unique items');
  }

  return details.join('; ');
};

const schemaPropertyApiItem = (property) => ({
  name: property.name,
  meta: [
    {
      label: 'Required',
      valueHtml: renderCode(property.required),
    },
    property.typeHtml && {
      label: 'Type',
      valueHtml: property.typeHtml,
    },
    property.details && {
      label: 'Details',
      valueHtml: escapeHtml(property.details),
    },
  ],
});

const schemaSummary = (schema) => {
  if (schema.allOf) {
    return 'composition';
  }

  if (schema.oneOf) {
    return 'union';
  }

  return schema.type ? escapeHtml(schema.type) : 'schema';
};

const renderMetaDefinition = (label, valueHtml) => `
           <div class="api-meta__item">
             <dt class="api-meta__label">${escapeHtml(label)}</dt>
             <dd class="api-meta__value">${valueHtml}</dd>
           </div>
`;

const renderDescription = (description, className = '') => {
  if (!description) {
    return '';
  }

  const paragraphs = escapeHtml(description)
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .replace(/\n/g, ' ')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .trim()
    )
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return '';
  }

  return `
       <div${className ? ` class="${className}"` : ''}>
         ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
       </div>
  `;
};

const renderCode = (value) => `<code>${escapeHtml(value)}</code>`;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
