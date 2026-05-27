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
    const manifest = data.api['11tydata'].customElements;
    const elements = manifest.modules
      .reduce(
        (els, module) =>
          els.concat(
            module.declarations?.filter((dec) => dec.customElement) ?? []
          ),
        []
      )
      .filter((element) => element.tagName === 'commerce-hub-connect');
    return `
     <h1>API</h1>
     ${elements
       .map(
         (element) => `
       <h2>&lt;${element.tagName}></h2>
       <div>
         ${element.description}
       </div>
       ${renderTable(
         'Attributes',
         ['name', 'description', 'type.text', 'default'],
         element.attributes
       )}
       ${renderTable(
         'Properties',
         ['name', 'attribute', 'description', 'type.text', 'default'],
         element.members.filter(
           (m) => m.kind === 'field' && m.privacy !== 'private'
         )
       )}  
       ${renderTable(
         'Methods',
         ['name', 'parameters', 'description', 'return.type.text'],
         element.members
           .filter((m) => m.kind === 'method' && m.privacy !== 'private')
           .map((m) => ({
             ...m,
             parameters: renderTable(
               '',
               ['name', 'description', 'type.text'],
               m.parameters
             ),
           }))
       )}
       ${renderTable(
         'Events',
         ['name', 'description'],
         normalizeEvents(element.events)
       )}    
       ${renderTable(
         'Slots',
         [['name', '(default)'], 'description'],
         element.slots
       )}  
       ${renderTable(
         'CSS Shadow Parts',
         ['name', 'description'],
         element.cssParts
       )}
       ${renderTable(
         'CSS Custom Properties',
         ['name', 'description'],
         element.cssProperties
       )}
       `
       )
       .join('')}
   `;
  }
};

const normalizeEvents = (events) => {
  const normalized =
    events?.map((event) => {
      if (event.name !== 'ON_SUCCESS_EVENT') {
        return event;
      }

      return {
        ...event,
        name: 'onSuccess',
        description:
          event.description ||
          'Emitted with the selected PaymentSource after a verified payment source is attached or selected.',
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

/**
 * Reads a (possibly deep) path off of an object.
 */
const get = (obj, path) => {
  let fallback = '';
  if (Array.isArray(path)) {
    [path, fallback] = path;
  }
  const parts = path.split('.');
  while (obj && parts.length) {
    obj = obj[parts.shift()];
  }
  return obj == null || obj === '' ? fallback : obj;
};

/**
 * Renders a table of data, plucking the given properties from each item in
 * `data`.
 */
const renderTable = (name, properties, data) => {
  if (data === undefined || data.length === 0) {
    return '';
  }
  return `
   ${name ? `<h3>${name}</h3>` : ''}
   <table>
     <tr>
       ${properties
         .map(
           (p) =>
             `<th>${capitalize(
               (Array.isArray(p) ? p[0] : p).split('.')[0]
             )}</th>`
         )
         .join('')}
     </tr>
     ${data
       .map(
         (i) => `
       <tr>
         ${properties.map((p) => `<td>${get(i, p)}</td>`).join('')}
       </tr>
     `
       )
       .join('')}
   </table>
 `;
};

const capitalize = (s) => s[0].toUpperCase() + s.substring(1);
