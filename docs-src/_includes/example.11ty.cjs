const page = require('./page.11ty.cjs');
const relative = require('./relative-path.cjs');

/**
 * This template extends the page template and adds an examples list.
 */
module.exports = function (data) {
  return page({
    ...data,
    content: renderExample(data),
  });
};

const renderExample = ({name, content, collections, page}) => {
  const exampleLinks =
    collections.example === undefined
      ? ''
      : collections.example
          .map((post) => {
            const selectedClass = post.url === page.url ? 'selected' : '';
            const description = post.data.description.replace(/</g, '&lt;');

            return `          <li class=${selectedClass}>
            <a href="${relative(page.url, post.url)}">${description}</a>
          </li>`;
          })
          .join('\n');

  return `
    <h1>Example: ${name}</h1>
    <section class="examples">
      <nav class="collection">
        <ul>
${exampleLinks}
        </ul>
      </nav>
      <div>
${content}
      </div>
    </section>
`;
};
