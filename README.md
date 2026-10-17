# remark-underline-u

**A robust Next.js newsletter `Next.js Weekly` is sponsoring me** 💖
[![NextjsWeekly banner](./assets/next-js-weekly.png)](https://nextjsweekly.com/)

**An outstanding Git-based CMS `Outstatic` is also sponsoring me** 💖
[![Outstatic banner](./assets/outstatic-banner-dark.jpg)](https://outstatic.com/?utm_source=github&utm_medium=readme&utm_campaign=next-mdx-remote-client)

A warm thanks 🙌 to [@ErfanEbrahimnia](https://github.com/ErfanEbrahimnia), [@avitorio](https://github.com/avitorio), [@recepkyk](https://github.com/recepkyk), and [@LSeaburg](https://github.com/LSeaburg) for the [support](https://github.com/sponsors/ipikuka) 💖

---

[![npm version][badge-npm-version]][url-npm-package]
[![npm downloads][badge-npm-download]][url-npm-package]
[![publish to npm][badge-publish-to-npm]][url-publish-github-actions]
[![code-coverage][badge-codecov]][url-codecov]
[![type-coverage][badge-type-coverage]][url-github-package]
[![typescript][badge-typescript]][url-typescript]
[![license][badge-license]][url-license]

This package is a [**unified**][unified] ([**remark**][remark]) plugin **to add custom `<u>` element in markdown.**

[**unified**][unified] is a project that transforms content with abstract syntax trees (ASTs) using the new parser [**micromark**][micromark]. [**remark**][remark] adds support for markdown to unified. [**mdast**][mdast] is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree.

**This plugin is a remark plugin that transforms the mdast.**

## When should I use this?

**`remark-underline-u`** is useful if you want to **add a `<u>` element** in markdown, which represents a range of text that has been underlined in a document.

**You can easily create `<u>` element with `remark-underline-u`.**

## Installation

This package is suitable for ESM only. In Node.js (version 16+), install with npm:

```bash
npm install remark-underline-u
```

or

```bash
yarn add remark-underline-u
```

## Usage

#### use `!!` around the content

Say we have the following file, `example.md`, which consists some flexible markers.

```markdown
!!underlined text!!
```

And our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import remark from "remark";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkUnderline from "remark-underline-u";

main();

async function main() {
  const file = await remark()
    .use(gfm)
    .use(remarkUnderline)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read("example.md"));

  console.log(String(file));
}
```

Now, running `node example.js` yields:

```html
<p><u class="remark-underline">underlined text</u></p>
```

Without **`remark-underline-u`**, you’d get:

```html
<p>!!underlined text!!</p>
```

> [!CAUTION]
> **The double exclamation signs must be adjacent to the content**.\
> **The content must be wrapped with double exclamation signs, not singular at any side.**\

Here are some bad usage, and will not work.

```markdown
!!text with bad wrapped!

!text with bad wrapped!!

!! text with unwanted space!!

!!text with unwanted space !!
```

## It is more flexible and powerful

**`remark-underline-u`** can handle also the syntax containing other markdown phrases like `strong`, `emphasis`, `link` etc. For example:

```
!!**underlined bold content**!!

!!_underlined italic content_!!

!![underlined link](https://google.com)!!
```

```html
<p>
  <u class="remark-underline">
    <strong>underlined bold content</strong>
  </u>
</p>
<p>
  <u class="remark-underline">
    <em>underlined italic content</em>
  </u>
</p>
<p>
  <u class="remark-underline">
    <a href="https://google.com">underlined link</a>
  </u>
</p>
```

## Options

There is no option for **`remark-underline-u`**.

## Example:

```markdown
!!underlined content!!

**!!underlined bold content!!** and !!**underlined bold content**!!

### Heading with !!underlined content!!
```
is going to produce as default:

```html
<p>
  <u class="remark-underline">underlined content</u>
</p>
<p>
  <strong><u class="remark-underline">underlined bold content</u></strong>
   and 
  <u class="remark-underline"><strong>underlined bold content</strong></u>
</p>
<h3>Heading with <u class="remark-underline">underlined content</u></h3>
```

You can use the underline syntax in the tables, headings, lists, blockquotes etc. For detailed examples, you can have a look at the test files in the github repo.

## Syntax tree

This plugin only modifies the mdast (markdown abstract syntax tree) as explained.

## Types

This package is fully typed with [TypeScript][url-typescript].

## Compatibility

This plugin works with `unified` version 6+ and `remark` version 7+. It is compatible with `mdx` version 2+.

## Security

Use of **`remark-underline-u`** does not involve rehype (hast) or user content so there are no openings for cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### Support My Work ([become a sponsor](https://github.com/sponsors/ipikuka) 🚀)

If you find **`remark-underline-u`** or any of my projects is useful and helpful, please consider supporting my work. Your sponsorship means a lot to me and keeps these projects alive and updated! 💖

My sponsors are going to be featured at the very top of the page and proudly displayed on my [Sponsor Wall](https://github.com/sponsors/ipikuka).

Thank you for supporting open source! 🙌

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-underline-u`](https://www.npmjs.com/package/remark-underline-u)
  – Remark plugin to add `u` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via `vfile.data` or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)
- [`remark-mdx-remove-expressions`](https://www.npmjs.com/package/remark-mdx-remove-expressions)
  – Remark plugin to remove MDX expressions within curlybraces {} in MDX content

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element
- [`rehype-highlight-code-lines`](https://www.npmjs.com/package/rehype-highlight-code-lines)
  – Rehype plugin to add line numbers to code blocks and allow highlighting of desired code lines
- [`rehype-code-meta`](https://www.npmjs.com/package/rehype-code-meta)
  – Rehype plugin to copy `code.data.meta` to `code.properties.metastring`
- [`rehype-image-toolkit`](https://www.npmjs.com/package/rehype-image-toolkit)
  – Rehype plugin to enhance Markdown image syntax `![]()` and Markdown/MDX media elements (`<img>`, `<audio>`, `<video>`) by auto-linking bracketed or parenthesized image URLs, wrapping them in `<figure>` with optional captions, unwrapping images/videos/audio from paragraph, parsing directives in title for styling and adding attributes, and dynamically converting images into `<video>` or `<audio>` elements based on file extension.

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.
- [`recma-mdx-change-imports`](https://www.npmjs.com/package/recma-mdx-change-imports)
  – Recma plugin to convert import declarations for assets and media with relative links into variable declarations with string URLs, enabling direct asset URL resolution in compiled MDX.
- [`recma-mdx-import-media`](https://www.npmjs.com/package/recma-mdx-import-media)
  – Recma plugin to turn media relative paths into import declarations for both markdown and html syntax in MDX.
- [`recma-mdx-import-react`](https://www.npmjs.com/package/recma-mdx-import-react)
  – Recma plugin to ensure getting `React` instance from the arguments and to make the runtime props `{React, jsx, jsxs, jsxDev, Fragment}` is available in the dynamically imported components in the compiled source of MDX.
- [`recma-mdx-html-override`](https://www.npmjs.com/package/recma-mdx-html-override)
  – Recma plugin to allow selected raw HTML elements to be overridden via MDX components.
- [`recma-mdx-interpolate`](https://www.npmjs.com/package/recma-mdx-interpolate)
  – Recma plugin to enable interpolation of identifiers wrapped in curly braces within the `alt`, `src`, `href`, and `title` attributes of markdown link and image syntax in MDX.

### My Unist Utils and Unified Plugins

I also build low-level utilities and plugins for the Unified ecosystem that can be used across Remark, Rehype, Recma, and other unist-based abstract syntax trees (ASTs).

- [`unist-util-find-between`](https://www.npmjs.com/package/unist-util-find-between)
  – Unist utility to find the nodes between two nodes.
- [`unified-log-tree`](https://www.npmjs.com/package/unified-log-tree)
  – Unified plugin to log abstract syntax trees (ASTs) for debugging without mutating.

## License

[MIT License](./LICENSE) © ipikuka

[unified]: https://github.com/unifiedjs/unified
[micromark]: https://github.com/micromark/micromark
[remark]: https://github.com/remarkjs/remark
[remarkplugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
[mdast]: https://github.com/syntax-tree/mdast

[badge-npm-version]: https://img.shields.io/npm/v/remark-underline-u
[badge-npm-download]:https://img.shields.io/npm/dt/remark-underline-u
[url-npm-package]: https://www.npmjs.com/package/remark-underline-u
[url-github-package]: https://github.com/ipikuka/remark-underline-u

[badge-license]: https://img.shields.io/github/license/ipikuka/remark-underline-u
[url-license]: https://github.com/ipikuka/remark-underline-u/blob/main/LICENSE

[badge-publish-to-npm]: https://github.com/ipikuka/remark-underline-u/actions/workflows/publish.yml/badge.svg
[url-publish-github-actions]: https://github.com/ipikuka/remark-underline-u/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/remark-underline-u
[url-typescript]: https://www.typescriptlang.org/

[badge-codecov]: https://codecov.io/gh/ipikuka/remark-underline-u/graph/badge.svg?token=MHjBtIDXYK
[url-codecov]: https://codecov.io/gh/ipikuka/remark-underline-u

[badge-type-coverage]: https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Fremark-underline-u%2Fmaster%2Fpackage.json
